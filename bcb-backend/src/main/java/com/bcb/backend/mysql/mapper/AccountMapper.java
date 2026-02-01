package com.bcb.backend.mysql.mapper;

import com.bcb.backend.mysql.dto.request.AccountRequest;
import com.bcb.backend.mysql.dto.response.AccountResponse;
import com.bcb.backend.mysql.model.Account;

public class AccountMapper {
    
    public static AccountResponse toDTO(Account entity) {

        return AccountResponse.builder()
                .id(entity.getId())
                .username(entity.getUsername())
                .role(entity.getRole())
                .phoneNumber(entity.getPhoneNumber())
                .imagePath(entity.getImagePath())
                .isActivated(entity.isActivated())
                .build();

    }

    public static Account toEntity(AccountRequest request) {

        return Account.builder()
                .username(request.getUsername())
                .password(request.getPassword())
                .phoneNumber(request.getPhoneNumber())
                .build();

    }

}
