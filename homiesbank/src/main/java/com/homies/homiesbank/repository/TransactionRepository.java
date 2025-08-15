package com.homies.homiesbank.repository;

import com.homies.homiesbank.model.Transaction;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface TransactionRepository extends MongoRepository<Transaction, String> {
}
