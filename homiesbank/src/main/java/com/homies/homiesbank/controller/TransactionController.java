package com.homies.homiesbank.controller;

import com.homies.homiesbank.model.OweMatrixEntry;
import com.homies.homiesbank.model.Transaction;
import com.homies.homiesbank.service.OweMatrixService;
import com.homies.homiesbank.service.TransactionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "*")
public class TransactionController {
    private final TransactionService transactionService;
    private final OweMatrixService oweMatrixService;

    public TransactionController(TransactionService transactionService, OweMatrixService oweMatrixService) {
        this.transactionService = transactionService;
        this.oweMatrixService = oweMatrixService;
    }

    @PostMapping
    public Transaction createTransaction(@RequestBody Transaction transaction) {
        return transactionService.addTransaction(transaction);
    }

    @GetMapping
    public List<Transaction> getTransactions() {
        return transactionService.getAllTransactions();
    }
    @GetMapping("/owe-matrix")
    public List<OweMatrixEntry> getOweMatrix() {
        return oweMatrixService.calculateOweMatrix();
    }

}
