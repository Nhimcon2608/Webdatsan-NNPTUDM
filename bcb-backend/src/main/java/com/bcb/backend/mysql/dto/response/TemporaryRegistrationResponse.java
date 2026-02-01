package com.bcb.backend.mysql.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TemporaryRegistrationResponse {
    private String temporaryRecruitmentId;
    private String playerId;
}
