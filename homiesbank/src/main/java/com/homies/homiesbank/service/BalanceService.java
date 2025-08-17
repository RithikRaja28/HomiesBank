package com.homies.homiesbank.service;

import com.homies.homiesbank.model.Balance;
import com.homies.homiesbank.model.Transaction;
import com.homies.homiesbank.repository.BalanceRepository;
import com.homies.homiesbank.repository.TransactionRepository;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

@Service
public class BalanceService {
    private final BalanceRepository balanceRepository;
    private final TransactionService transactionService;
    private final TransactionRepository transactionRepository;

    public BalanceService(BalanceRepository balanceRepository,
                          TransactionService transactionService,
                          TransactionRepository transactionRepository) {
        this.balanceRepository = balanceRepository;
        this.transactionService = transactionService;
        this.transactionRepository = transactionRepository;
    }

    // Get all balances
    public List<Balance> getAllBalances() {
        return balanceRepository.findAll();
    }

    // Add balance to a user
    public void addBalance(String username, double amount) {
        Balance balance = balanceRepository.findByUsername(username);
        if (balance == null) {
            throw new RuntimeException("User balance not found");
        }

        balance.setAmount(balance.getAmount() + amount);
        balanceRepository.save(balance);
        System.out.println("New balance for " + username + ": " + balance.getAmount());
    }


    // Pay all debts for a user
    // Pay all debts for a user
    public void payDebts(String username) {
        Balance debtorBalance = balanceRepository.findByUsername(username);
        if (debtorBalance == null) return;

        Map<String, Map<String, Double>> oweMatrix = transactionService.calculateOweMatrix();
        Map<String, Double> debts = oweMatrix.get(username);
        if (debts == null || debts.isEmpty()) return;

        double totalDebt = debts.values().stream().mapToDouble(Double::doubleValue).sum();
        if (debtorBalance.getAmount() < totalDebt) {
            throw new RuntimeException("Insufficient balance to settle debts");
        }

        // Process each debt individually
        for (Map.Entry<String, Double> entry : debts.entrySet()) {
            String creditor = entry.getKey();
            double amount = entry.getValue();

            // Deduct from debtor
            debtorBalance.setAmount(debtorBalance.getAmount() - amount);

            // Add to creditor
            Balance creditorBalance = balanceRepository.findByUsername(creditor);
            if (creditorBalance != null) {
                creditorBalance.setAmount(creditorBalance.getAmount() + amount);
                balanceRepository.save(creditorBalance);
            }

            // Remove this debt from transactions
            List<Transaction> transactions = transactionService.getAllTransactions();
            for (Transaction tx : transactions) {
                if (tx.getPayer().equals(creditor) && tx.getPayees() != null) {
                    tx.getPayees().removeIf(p -> p.getUsername().equals(username));
                    transactionRepository.save(tx);
                }
            }

            System.out.println(username + " paid " + amount + " to " + creditor);
        }

        balanceRepository.save(debtorBalance);
        System.out.println("New balance for " + username + ": " + debtorBalance.getAmount());
    }


}
