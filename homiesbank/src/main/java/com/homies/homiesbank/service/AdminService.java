package com.homies.homiesbank.service;

import com.homies.homiesbank.model.User;
import com.homies.homiesbank.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class AdminService {
    private final UserRepository userRepository;

    public AdminService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public void settleDebt(String fromUsername, String toUsername, double amount) {
        User fromUser = userRepository.findByUsername(fromUsername)
                .orElseThrow(() -> new RuntimeException("From user not found"));
        User toUser = userRepository.findByUsername(toUsername)
                .orElseThrow(() -> new RuntimeException("To user not found"));

        if (fromUser.getBalance() < amount) {
            throw new RuntimeException("Insufficient balance for settlement");
        }

        fromUser.setBalance(fromUser.getBalance() - amount);
        toUser.setBalance(toUser.getBalance() + amount);

        userRepository.save(fromUser);
        userRepository.save(toUser);
    }
}
