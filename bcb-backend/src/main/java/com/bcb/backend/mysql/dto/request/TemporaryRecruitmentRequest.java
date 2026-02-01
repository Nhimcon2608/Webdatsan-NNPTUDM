package com.bcb.backend.mysql.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TemporaryRecruitmentRequest {

    private short quantity;
    private String content;
    private Boolean available;
    private String reservationId;

}
