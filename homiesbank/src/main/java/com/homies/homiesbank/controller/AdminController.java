package com.homies.homiesbank.controller;

import com.homies.homiesbank.service.AdminService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {
    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PostMapping("/settle")
    public String settleDebt(@RequestParam String fromUsername,
                             @RequestParam String toUsername,
                             @RequestParam double amount) {
        adminService.settleDebt(fromUsername, toUsername, amount);
        return "Debt settled successfully";
    }
}
