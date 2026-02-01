package com.bcb.backend.mysql.mapper;

import java.util.stream.Collectors;

import com.bcb.backend.mysql.dto.request.OwnerRequest;
import com.bcb.backend.mysql.dto.response.OwnerResponse;
import com.bcb.backend.mysql.model.Owner;

public class OwnerMapper {

    public static OwnerResponse toDTO(Owner owner) {
        return OwnerResponse.builder()
                .id(owner.getId())
                .ownerName(owner.getOwnerName())
                .phoneNumber(owner.getPhoneNumber())
                .email(owner.getEmail())
                .partnershipRequest(owner.getPartnershipRequests().stream().map(PartnershipRequestMapper::toDTO)
                        .collect(Collectors.toList()))
                .build();
    }

    public static Owner toEntity(OwnerRequest ownerDTO) {
        return Owner.builder()
                .id(ownerDTO.getId())
                .ownerName(ownerDTO.getOwnerName())
                .phoneNumber(ownerDTO.getPhoneNumber())
                .email(ownerDTO.getEmail())
                .build();
    }
}