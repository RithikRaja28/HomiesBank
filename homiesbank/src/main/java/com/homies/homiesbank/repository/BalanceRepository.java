package com.homies.homiesbank.repository;

import com.homies.homiesbank.model.Balance;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface BalanceRepository extends MongoRepository<Balance, String> {
    Balance findByUsername(String username);
}
