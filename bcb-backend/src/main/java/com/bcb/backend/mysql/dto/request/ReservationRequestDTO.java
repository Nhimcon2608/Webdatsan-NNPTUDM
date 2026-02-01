package com.bcb.backend.mysql.dto.request;

import java.math.BigDecimal;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Data;

@Data
public class ReservationRequestDTO {

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Ho_Chi_Minh")
    private Date bookAt;
    
    private BigDecimal totalPrice;
    private BigDecimal deposit;
    private String status;
    private String playerId;
    private String voucherId;
    private String branchId;
}
