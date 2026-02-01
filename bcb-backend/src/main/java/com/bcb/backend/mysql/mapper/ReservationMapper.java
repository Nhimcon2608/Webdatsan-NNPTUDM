package com.bcb.backend.mysql.mapper;

import com.bcb.backend.mysql.dto.request.ReservationRequestDTO;
import com.bcb.backend.mysql.dto.response.ReservationResponseDTO;
import com.bcb.backend.mysql.model.Reservation;

import java.util.stream.Collectors;

public class ReservationMapper {

    public static ReservationResponseDTO toDTO(Reservation reservation) {
        return ReservationResponseDTO.builder()
                .id(reservation.getId())
                .createAt(reservation.getCreateAt())
                .bookAt(reservation.getBookAt())
                .totalPrice(reservation.getTotalPrice())
                .deposit(reservation.getDeposit())
                .status(reservation.getStatus())
                .branchId(reservation.getBranch() != null ? reservation.getBranch().getId() : null)
                .playerId(reservation.getPlayer() != null ? reservation.getPlayer().getId() : null)
                .playerName(reservation.getPlayer().getFullName())
                .voucherId(reservation.getVoucher() != null ? reservation.getVoucher().getId() : null)
                .reservationDetails(
                        reservation.getReservationDetails() != null ? reservation.getReservationDetails().stream()
                                .map(ReservationDetailMapper::toDTO)
                                .collect(Collectors.toList()) : null)
                .build();
    }

    public static void updateEntity(Reservation reservation, ReservationRequestDTO dto) {
        reservation.setBookAt(dto.getBookAt());
        reservation.setTotalPrice(dto.getTotalPrice());
        reservation.setDeposit(dto.getDeposit());
        reservation.setStatus(dto.getStatus());
    }
}
