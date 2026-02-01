package com.bcb.backend.mysql.dto;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PartnershipRequestDTO {
    
    private String id;
    private Date createAt;
    private String branchName;
    private String address;
    private String phoneNumber;
    private String status;
    
}
