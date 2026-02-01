package com.bcb.backend.mysql.dto.request;

import java.time.LocalTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GetTotalPrice {

    private LocalTime start;
    private short rentalTime;
  
}
