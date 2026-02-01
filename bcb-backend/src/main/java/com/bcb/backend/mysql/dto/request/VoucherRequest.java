package com.bcb.backend.mysql.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VoucherRequest {
    private double discountRate;
    private String event;
    private boolean isAvailable;
    private String branchId;
}
