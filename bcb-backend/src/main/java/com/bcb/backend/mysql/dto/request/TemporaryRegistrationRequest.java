package com.bcb.backend.mysql.dto.request;

import lombok.Data;

@Data
public class TemporaryRegistrationRequest {
    private String temporaryRecruitmentId;
    private String playerId;
}
