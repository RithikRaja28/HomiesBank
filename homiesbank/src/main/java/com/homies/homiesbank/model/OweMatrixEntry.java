package com.homies.homiesbank.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OweMatrixEntry {
    private String fromUser;
    private String toUser;
    private double amount;
    private String description;
    private Date date;// new field
}
