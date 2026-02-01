package com.bcb.backend.mysql.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class VoucherResponse {
    private String id;
    private Date createAt;
    private double discountRate;
    private String event;
    private boolean isAvailable;
    private String branchName;
}
