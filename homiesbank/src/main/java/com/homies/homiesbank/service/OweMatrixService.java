package com.homies.homiesbank.service;

import com.homies.homiesbank.model.OweMatrixEntry;
import com.homies.homiesbank.model.Transaction;
import com.homies.homiesbank.repository.TransactionRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class OweMatrixService {
    private final TransactionRepository transactionRepository;

    public OweMatrixService(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    public List<OweMatrixEntry> calculateOweMatrix() {
        List<Transaction> transactions = transactionRepository.findAll();
        List<OweMatrixEntry> result = new ArrayList<>();

        for (Transaction tx : transactions) {
            String payer = tx.getPayer();
            String description = tx.getDescription();
            Date date = tx.getDate(); // get transaction date

            if (tx.getPayees() == null || tx.getPayees().isEmpty()) continue;

            for (Transaction.PayeeInfo payee : tx.getPayees()) {
                String debtor = payee.getUsername();
                double amount = payee.getAmountOwed();

                if (debtor.equals(payer)) continue;

                result.add(new OweMatrixEntry(debtor, payer, amount, description, date));
            }
        }

        return result;
    }
}
