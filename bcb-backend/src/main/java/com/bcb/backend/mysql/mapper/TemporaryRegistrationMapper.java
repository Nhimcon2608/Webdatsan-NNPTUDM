package com.bcb.backend.mysql.mapper;

import com.bcb.backend.mysql.dto.request.TemporaryRegistrationRequest;
import com.bcb.backend.mysql.dto.response.TemporaryRegistrationResponse;
import com.bcb.backend.mysql.model.Player;
import com.bcb.backend.mysql.model.TemporaryRecruitment;
import com.bcb.backend.mysql.model.TemporaryRegistration;
import com.bcb.backend.mysql.model.TemporaryRegistrationId;

public class TemporaryRegistrationMapper {

    public static TemporaryRegistration toEntity(TemporaryRegistrationRequest request, TemporaryRecruitment recruitment,
            Player player) {
        return TemporaryRegistration.builder()
                .id(new TemporaryRegistrationId(recruitment.getId(), player.getId()))
                .temporaryRecruitment(recruitment)
                .player(player)
                .build();
    }

    public static TemporaryRegistrationResponse toDTO(TemporaryRegistration entity) {
        return TemporaryRegistrationResponse.builder()
                .temporaryRecruitmentId(entity.getTemporaryRecruitment().getId())
                .playerId(entity.getPlayer().getId())
                .build();
    }
}
