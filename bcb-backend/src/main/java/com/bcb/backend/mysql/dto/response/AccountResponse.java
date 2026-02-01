package com.bcb.backend.mysql.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AccountResponse {
    
    private String id;
    private String username;
    private String role;
    private String phoneNumber;
    private String imagePath;
    private boolean isActivated;

}
