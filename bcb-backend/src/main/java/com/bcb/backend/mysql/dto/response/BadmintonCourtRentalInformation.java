package com.bcb.backend.mysql.dto.response;

import java.time.LocalTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BadmintonCourtRentalInformation {

    private short ordinalNumber;
    private LocalTime startTime;
    private double rentalTime;
        
}
