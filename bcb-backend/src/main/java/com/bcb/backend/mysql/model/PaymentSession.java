package com.bcb.backend.mysql.model;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaymentSession {

    private String paymentSessionId;
    private List<String> reservationIds;
    private String totalAmount;
    private String status;
    private long createdAt;
}
