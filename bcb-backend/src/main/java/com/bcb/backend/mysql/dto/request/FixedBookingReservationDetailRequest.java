package com.bcb.backend.mysql.dto.request;

import java.time.LocalTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FixedBookingReservationDetailRequest {

    private String badmintonCourtId;
    
    @JsonFormat(pattern = "H:mm")
    private LocalTime startTime;
    
    private double rentalTime;
}
