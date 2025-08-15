package com.homies.homiesbank.service;

import com.homies.homiesbank.model.User;
import com.homies.homiesbank.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User register(String username, String password, String role) {
        if (userRepository.findByUsername(username).isPresent()) {
            throw new RuntimeException("User already exists");
        }

        String finalRole = "ADMIN".equalsIgnoreCase(role) ? "ADMIN" : "HOUSEMATE";

        User user = User.builder()
                .username(username)
                .password(passwordEncoder.encode(password))
                .role(finalRole)
                .balance(0)
                .build();

        return userRepository.save(user);
    }

    public User login(String username, String password) {
        System.out.println("Attempting login for user: " + username);
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (!userOpt.isPresent()) {
            System.out.println("User not found!");
            throw new RuntimeException("Invalid username or password");
        }

        User user = userOpt.get();
        System.out.println("Stored password: " + user.getPassword());

        if (passwordEncoder.matches(password, user.getPassword())) {
            user.setPassword(null);
            return user;
        } else {
            System.out.println("Password mismatch!");
            throw new RuntimeException("Invalid username or password");
        }
    }


    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
