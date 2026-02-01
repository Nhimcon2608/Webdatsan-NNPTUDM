package com.bcb.backend.mysql.dto.request;

import java.time.LocalTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Data;

@Data
public class ReservationDetailRequest {

    private String reservationId;
    private String badmintonCourtId;
    
    @JsonFormat(pattern = "H:mm")
    private LocalTime startTime;
    
    private double rentalTime;
}
