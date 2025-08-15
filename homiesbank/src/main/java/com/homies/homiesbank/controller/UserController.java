package com.homies.homiesbank.controller;

import com.homies.homiesbank.model.User;
import com.homies.homiesbank.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // Signup
    @PostMapping("/signup")
    public String signup(@RequestBody User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return "User already exists!";
        }
        userRepository.save(user);
        return "Signup successful!";
    }

    // Login
    @PostMapping("/login")
    public String login(@RequestBody User user) {
        Optional<User> existingUser = userRepository.findByUsername(user.getUsername());
        if (existingUser.isPresent() && existingUser.get().getPassword().equals(user.getPassword())) {
            return "Login successful! Role: " + existingUser.get().getRole();
        }
        return "Invalid username or password!";
    }
}
