package com.bcb.backend.mysql.dto.request;

import lombok.Data;

@Data
public class BadmintonCourtRequest {
    private short ordinalNumber;
    private boolean isAvailable;
    private String branchId;
}
