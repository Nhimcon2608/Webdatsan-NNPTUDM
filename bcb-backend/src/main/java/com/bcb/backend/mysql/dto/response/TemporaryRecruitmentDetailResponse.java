package com.bcb.backend.mysql.dto.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TemporaryRecruitmentDetailResponse {
    
    private String id;    
    private String address;
    private List<BadmintonCourtRentalInformation> badmintonCourtRentalInformations;
}
