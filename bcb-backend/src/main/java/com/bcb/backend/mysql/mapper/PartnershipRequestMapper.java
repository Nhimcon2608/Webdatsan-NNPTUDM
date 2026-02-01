package com.bcb.backend.mysql.mapper;

import com.bcb.backend.mysql.dto.request.PartnershipRequestRequest;
import com.bcb.backend.mysql.dto.response.PartnershipRequestResponse;
import com.bcb.backend.mysql.model.PartnershipRequest;

public class PartnershipRequestMapper {

    public static PartnershipRequestResponse toDTO(PartnershipRequest partnershipRequest) {
        return PartnershipRequestResponse.builder()
                .id(partnershipRequest.getId())
                .createAt(partnershipRequest.getCreateAt())
                .branchName(partnershipRequest.getBranchName())
                .address(partnershipRequest.getAddress())
                .phoneNumber(partnershipRequest.getPhoneNumber())
                .status(partnershipRequest.getStatus())
                .build();
    }

    public static PartnershipRequest toEntity(PartnershipRequestRequest partnershipRequestDTO) {
        return PartnershipRequest.builder()
                .id(partnershipRequestDTO.getId())
                .branchName(partnershipRequestDTO.getBranchName())
                .address(partnershipRequestDTO.getAddress())
                .phoneNumber(partnershipRequestDTO.getPhoneNumber())
                .status(partnershipRequestDTO.getStatus())
                .build();
    }

}
