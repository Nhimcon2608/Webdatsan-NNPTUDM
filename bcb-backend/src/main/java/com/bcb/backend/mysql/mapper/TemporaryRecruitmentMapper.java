package com.bcb.backend.mysql.mapper;

import java.util.Date;

import com.bcb.backend.mysql.dto.request.TemporaryRecruitmentRequest;
import com.bcb.backend.mysql.dto.response.TemporaryRecruitmentCompactResponse;
import com.bcb.backend.mysql.model.Reservation;
import com.bcb.backend.mysql.model.TemporaryRecruitment;
import com.bcb.backend.mongo.service.TemporaryRecruitmentContentService;;

public class TemporaryRecruitmentMapper {

    public static TemporaryRecruitment toEntity(TemporaryRecruitmentRequest request, Reservation reservation) {
        return TemporaryRecruitment.builder()
                .quantity(request.getQuantity())
                .isAvailable(request.getAvailable())
                .reservation(reservation)
                .createAt(new Date())
                .build();
    }

    public static TemporaryRecruitmentCompactResponse toDTO(
            TemporaryRecruitment temporaryRecruitment,
            TemporaryRecruitmentContentService trcService) {

        return TemporaryRecruitmentCompactResponse.builder()
                .id(temporaryRecruitment.getId())
                .createAt(temporaryRecruitment.getCreateAt())
                .quantity(temporaryRecruitment.getQuantity())
                .isAvailable(temporaryRecruitment.isAvailable())
                .reservationId(temporaryRecruitment.getReservation() != null
                        ? temporaryRecruitment.getReservation().getId()
                        : null)
                .content(trcService.getContent(temporaryRecruitment.getId()))
                .bookAt(temporaryRecruitment.getReservation().getBookAt())
                .username(temporaryRecruitment.getReservation().getPlayer().getAccount().getUsername())
                .imagePath(temporaryRecruitment.getReservation().getPlayer().getAccount().getImagePath())
                .branchName(temporaryRecruitment.getReservation().getBranch().getBranchName())
                .build();
    }

}
