package com.homies.homiesbank.service;

import com.homies.homiesbank.model.Transaction;
import com.homies.homiesbank.repository.TransactionRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class TransactionService {
    private final TransactionRepository transactionRepository;

    public TransactionService(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    // ✅ Add a new transaction and split amounts equally
    public Transaction addTransaction(Transaction transaction) {
        if (transaction.getPayees() == null || transaction.getPayees().isEmpty()) {
            throw new RuntimeException("Payees list cannot be empty");
        }

        double splitAmount = transaction.getTotalAmount() / transaction.getPayees().size();

        List<Transaction.PayeeInfo> updatedPayees = transaction.getPayees().stream()
                .map(p -> Transaction.PayeeInfo.builder()
                        .username(p.getUsername())
                        .amountOwed(splitAmount)
                        .build())
                .collect(Collectors.toList());

        transaction.setPayees(updatedPayees);

        // description is already part of transaction object
        return transactionRepository.save(transaction);
    }


    // ✅ Fetch all transactions
    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

    // ✅ Calculate owe matrix
    public Map<String, Map<String, Double>> calculateOweMatrix() {
        List<Transaction> transactions = transactionRepository.findAll();
        Map<String, Map<String, Double>> oweMatrix = new HashMap<>();

        for (Transaction tx : transactions) {
            String payer = tx.getPayer();
            if (tx.getPayees() == null) continue;

            for (Transaction.PayeeInfo payee : tx.getPayees()) {
                if (payee == null) continue;
                String debtor = payee.getUsername();
                double amount = payee.getAmountOwed();

                if (debtor == null || debtor.equals(payer)) continue;

                oweMatrix
                        .computeIfAbsent(debtor, k -> new HashMap<>())
                        .merge(payer, amount, Double::sum);
            }
        }

        return oweMatrix;
    }
}
