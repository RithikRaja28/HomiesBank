package com.homies.homiesbank.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "transactions")
public class Transaction {

    @Id
    private String id;
    private String payer;
    private double totalAmount;
    private String description; // add this
    private Date date; // new field
    private List<PayeeInfo> payees;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PayeeInfo {
        private String username;
        private double amountOwed;
    }
}
