package com.bcb.backend.mysql.service;

import com.bcb.backend.mysql.dto.request.ReservationDetailRequest;
import com.bcb.backend.mysql.dto.response.ReservationDetailResponse;
import com.bcb.backend.mysql.mapper.ReservationDetailMapper;
import com.bcb.backend.mysql.model.BadmintonCourt;
import com.bcb.backend.mysql.model.Reservation;
import com.bcb.backend.mysql.model.ReservationDetail;
import com.bcb.backend.mysql.model.ReservationDetailId;
import com.bcb.backend.mysql.repository.BadmintonCourtRepository;
import com.bcb.backend.mysql.repository.ReservationDetailRepository;
import com.bcb.backend.mysql.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Date;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReservationDetailService {

    private final ReservationDetailRepository reservationDetailRepository;
    private final ReservationRepository reservationRepository;
    private final BadmintonCourtRepository badmintonCourtRepository;
    private final PriceService priceService;

    public List<ReservationDetailResponse> getAllReservationDetails() {
        return reservationDetailRepository.findAll().stream()
                .map(ReservationDetailMapper::toDTO)
                .collect(Collectors.toList());
    }

    public ReservationDetailResponse getReservationDetail(String reservationId, String badmintonCourtId) {
        ReservationDetailId id = new ReservationDetailId(badmintonCourtId, reservationId);
        ReservationDetail detail = reservationDetailRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ReservationDetail not found"));
        return ReservationDetailMapper.toDTO(detail);
    }

    public ReservationDetailResponse createReservationDetail(ReservationDetailRequest dto) {
        Reservation reservation = reservationRepository.findById(dto.getReservationId())
                .orElseThrow(() -> new RuntimeException("Reservation not found"));

        // reservation.setBookAt(
        // Date.from(LocalDate.now().atStartOfDay(ZoneId.systemDefault()).toInstant()));

        BadmintonCourt court = badmintonCourtRepository.findById(dto.getBadmintonCourtId())
                .orElseThrow(() -> new RuntimeException("Badminton court not found"));

        ReservationDetail detail = new ReservationDetail();
        detail.setId(new ReservationDetailId(dto.getBadmintonCourtId(), dto.getReservationId()));
        detail.setReservation(reservation);
        detail.setBadmintonCourt(court);
        ReservationDetailMapper.updateEntity(detail, dto);

        // BigDecimal price = priceService.prepareTheBill(dto.getStartTime(),
        // dto.getRentalTime(),
        // court.getBranch().getId());

        // reservation.setTotalPrice(reservation.getTotalPrice().add(price));

        // court.setAvailable(false);

        reservationDetailRepository.save(detail);
        reservationRepository.save(reservation);
        // badmintonCourtRepository.save(court);

        return ReservationDetailMapper.toDTO(detail);
    }

    public ReservationDetailResponse updateReservationDetail(String reservationId, String badmintonCourtId,
            ReservationDetailRequest dto) {
        ReservationDetailId id = new ReservationDetailId(badmintonCourtId, reservationId);
        ReservationDetail detail = reservationDetailRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ReservationDetail not found"));

        ReservationDetailMapper.updateEntity(detail, dto);
        return ReservationDetailMapper.toDTO(reservationDetailRepository.save(detail));
    }

    public void deleteReservationDetail(String reservationId, String badmintonCourtId) {
        ReservationDetailId id = new ReservationDetailId(badmintonCourtId, reservationId);
        ReservationDetail detail = reservationDetailRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ReservationDetail not found"));

        Reservation reservation = detail.getReservation();
        BadmintonCourt court = detail.getBadmintonCourt();

        BigDecimal price = priceService.prepareTheBill(detail.getStartTime(), detail.getRentalTime(),
                court.getBranch().getId());
        reservation.setTotalPrice(reservation.getTotalPrice().subtract(price).max(BigDecimal.ZERO));

        court.setAvailable(true);

        reservationRepository.save(reservation);
        badmintonCourtRepository.save(court);
        reservationDetailRepository.delete(detail);
    }

    public List<ReservationDetailResponse> getByCourtAndDate(String courtId, LocalDate date) {
        Date startOfDay = Date.from(date.atStartOfDay(ZoneId.systemDefault()).toInstant());
        Date endOfDay = Date.from(date.atTime(LocalTime.MAX).atZone(ZoneId.systemDefault()).toInstant());

        return reservationDetailRepository.findByCourtIdAndBookAtBetween(courtId, startOfDay, endOfDay)
                .stream()
                .map(ReservationDetailMapper::toDTO)
                .collect(Collectors.toList());
    }

    public List<ReservationDetailResponse> getByCourtAndDateNotStatusCancel(String courtId, LocalDate date) {
        Date startOfDay = Date.from(date.atStartOfDay(ZoneId.systemDefault()).toInstant());
        Date endOfDay = Date.from(date.atTime(LocalTime.MAX).atZone(ZoneId.systemDefault()).toInstant());

        return reservationDetailRepository.findByCourtIdAndBookAtBetween(courtId, startOfDay, endOfDay)
                .stream()
                .filter(detail -> {
                    Reservation reservation = detail.getReservation();
                    return reservation != null && !"CANCEL".equalsIgnoreCase(reservation.getStatus());
                })
                .map(ReservationDetailMapper::toDTO)
                .collect(Collectors.toList());
    }

}
