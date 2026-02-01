package com.bcb.backend.mysql.dto.response;

import java.time.LocalTime;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ReservationDetailResponse {

    private String reservationId;
    private String badmintonCourtId;
    private LocalTime startTime;
    private String playerName;
    private double rentalTime;
}
