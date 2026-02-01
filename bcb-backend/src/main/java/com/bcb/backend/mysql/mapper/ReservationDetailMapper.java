package com.bcb.backend.mysql.mapper;

import com.bcb.backend.mysql.dto.request.ReservationDetailRequest;
import com.bcb.backend.mysql.dto.response.ReservationDetailResponse;
import com.bcb.backend.mysql.model.ReservationDetail;

public class ReservationDetailMapper {

    public static ReservationDetailResponse toDTO(ReservationDetail detail) {
        return ReservationDetailResponse.builder()
                .reservationId(detail.getReservation().getId())
                .badmintonCourtId(detail.getBadmintonCourt().getId())
                .startTime(detail.getStartTime())
                .rentalTime(detail.getRentalTime())
                // .extendedTime(detail.getExtendedTime())
                .playerName(detail.getReservation().getPlayer().getFullName())
                .build();
    }

    public static void updateEntity(ReservationDetail detail, ReservationDetailRequest dto) {
        detail.setStartTime(dto.getStartTime());
        detail.setRentalTime(dto.getRentalTime());
        // detail.setExtendedTime(dto.getExtendedTime());
    }
}
