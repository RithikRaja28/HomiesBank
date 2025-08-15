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
    public void payDebts(String username) {
        Balance balance = balanceRepository.findByUsername(username);
        if (balance == null) return;

        Map<String, Map<String, Double>> oweMatrix = transactionService.calculateOweMatrix();
        Map<String, Double> debts = oweMatrix.get(username);
        if (debts == null || debts.isEmpty()) return;

        double totalDebt = debts.values().stream().mapToDouble(Double::doubleValue).sum();
        if (balance.getAmount() < totalDebt) {
            throw new RuntimeException("Insufficient balance to settle debts");
        }

        balance.setAmount(balance.getAmount() - totalDebt);
        balanceRepository.save(balance);
        System.out.println("New balance: " + balance.getAmount());

        List<Transaction> transactions = transactionService.getAllTransactions();
        System.out.println("Paying debts for: " + username);
        for (Transaction tx : transactions) {
            if (tx.getPayees() == null) continue;
            if (tx.getPayees().removeIf(payee -> payee.getUsername().equals(username))) {
                transactionRepository.save(tx);
            }
        }
    }

}
