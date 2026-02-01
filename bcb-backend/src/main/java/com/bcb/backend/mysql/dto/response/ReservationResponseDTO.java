package com.bcb.backend.mysql.dto.response;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ReservationResponseDTO {

    private String id;
    private Date createAt;
    private Date bookAt;
    private BigDecimal totalPrice;
    private BigDecimal deposit;
    private String status;
    private String branchId;
    private String playerId;
    private String playerName;
    private String voucherId;
    private List<ReservationDetailResponse> reservationDetails;
    // PlayerResponse players;
}
