    package com.homies.homiesbank.service;

    import com.homies.homiesbank.model.OweMatrixEntry;
    import com.homies.homiesbank.model.Transaction;
    import com.homies.homiesbank.repository.TransactionRepository;
    import org.springframework.stereotype.Service;
    import org.springframework.web.bind.annotation.PostMapping;
    import org.springframework.web.bind.annotation.RequestBody;

    import java.util.*;

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

        public void clearDebtsForUser(String username) {
            List<Transaction> transactions = transactionRepository.findAll();
            for (Transaction tx : transactions) {
                if (tx.getPayees() == null) continue;
                tx.getPayees().removeIf(payee -> payee.getUsername().equals(username));
            }
            transactionRepository.saveAll(transactions);
        }





    }
