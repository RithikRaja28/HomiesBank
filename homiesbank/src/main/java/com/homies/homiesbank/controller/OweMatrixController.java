package com.homies.homiesbank.controller;

import com.homies.homiesbank.service.OweMatrixService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/owe")
@CrossOrigin(origins = "*")
public class OweMatrixController {
    private final OweMatrixService oweMatrixService;

    public OweMatrixController(OweMatrixService oweMatrixService) {
        this.oweMatrixService = oweMatrixService;
    }

    @GetMapping
    public Map<String, Map<String, Double>> getOweMatrix() {
        return (Map<String, Map<String, Double>>) oweMatrixService.calculateOweMatrix();
    }


}
