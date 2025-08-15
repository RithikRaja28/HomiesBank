package com.homies.homiesbank.controller;

import com.homies.homiesbank.model.Balance;
import com.homies.homiesbank.service.BalanceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/balances")
@CrossOrigin(origins = "*")
public class BalanceController {
    private final BalanceService balanceService;

    public BalanceController(BalanceService balanceService) {
        this.balanceService = balanceService;
    }

    @GetMapping
    public List<Balance> getAllBalances() {
        return balanceService.getAllBalances();
    }


    @PostMapping("/add")
    public ResponseEntity<?> addBalance(
            @RequestParam String username,
            @RequestParam double amount) {

        try {
            balanceService.addBalance(username, amount);
            return ResponseEntity.ok("Balance added successfully!");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }


    @PostMapping("/pay-debt")
    public String payDebt(@RequestParam String username) {
        balanceService.payDebts(username);
        return "Debt paid successfully!";
    }
}
