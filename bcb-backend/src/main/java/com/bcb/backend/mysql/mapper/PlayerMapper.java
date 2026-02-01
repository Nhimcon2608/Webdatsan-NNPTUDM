package com.bcb.backend.mysql.mapper;

import com.bcb.backend.mysql.dto.response.PlayerResponse;
import com.bcb.backend.mysql.model.Player;

public class PlayerMapper {

    public static PlayerResponse toDTO(Player player) {
        return PlayerResponse.builder()
            .id(player.getId())
            .fullName(player.getFullName())
            .dob(player.getDob())
            .gender(player.getGender())
            .email(player.getEmail())
            .build();
    }

}