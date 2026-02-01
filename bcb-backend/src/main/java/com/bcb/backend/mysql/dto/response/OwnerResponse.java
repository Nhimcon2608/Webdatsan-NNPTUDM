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
public class OwnerResponse {

    private String id;
    private String ownerName;
    private String phoneNumber;
    private String email;
    
    private List<PartnershipRequestResponse> partnershipRequest;
}
