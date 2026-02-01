package com.bcb.backend.mysql.dto.request;

import java.sql.Date;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlayerRequest {
    private String fullName;
    private Date dob;
    private Boolean gender;
    private String email;
}
