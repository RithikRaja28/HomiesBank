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

        public void updateOweEntry(String debtor, String payer, double amountPaid) {
            List<Transaction> transactions = transactionRepository.findAll();

            for (Transaction tx : transactions) {
                if (!tx.getPayer().equals(payer)) continue;
                if (tx.getPayees() == null) continue;

                for (Transaction.PayeeInfo payee : tx.getPayees()) {
                    if (payee.getUsername().equals(debtor)) {
                        double newAmount = payee.getAmountOwed() - amountPaid;

                        if (newAmount <= 0) {
                            // fully paid -> remove this payee from transaction
                            tx.getPayees().remove(payee);
                        } else {
                            // partially paid -> update amount
                            payee.setAmountOwed(newAmount);
                        }

                        transactionRepository.save(tx);
                        return; // stop after first match
                    }
                }
            }
        }






    }
