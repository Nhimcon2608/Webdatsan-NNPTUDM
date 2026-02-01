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
public class PlayerDetailResponse {

    private String id;
    private String fullName;
    private Date dob;
    private String gender;
    private String email;

    private String username;
    private String phoneNumber;
    private String imagePath;
}
