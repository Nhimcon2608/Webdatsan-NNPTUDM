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
public class PartnershipRequestResponse {
    
    private String id;
    private Date createAt;
    private String branchName;
    private String address;
    private String phoneNumber;
    private String status;
    
}
