package com.bcb.backend.mysql.dto.response;

import java.sql.Date;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlayerResponse {
    
    private String id;
    private String fullName;
    private Date dob;
    private Boolean gender;
    private String email;

}
