package com.bcb.backend.mysql.dto.response;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TemporaryRecruitmentCompactResponse {

    private String id;
    private Date createAt;
    private short quantity;
    private boolean isAvailable;
    private String reservationId;
    private String content;

    private Date bookAt;

    private String username;
    private String imagePath;
    
    private String branchName;
}
