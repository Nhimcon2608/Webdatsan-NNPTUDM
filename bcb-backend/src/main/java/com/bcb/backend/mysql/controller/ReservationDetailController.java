package com.bcb.backend.mysql.controller;

import com.bcb.backend.mysql.dto.request.ReservationDetailRequest;
import com.bcb.backend.mysql.dto.response.ReservationDetailResponse;
import com.bcb.backend.mysql.service.ReservationDetailService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/reservation-details")
public class ReservationDetailController {

    @Autowired
    private ReservationDetailService reservationDetailService;

    @GetMapping
    public List<ReservationDetailResponse> getAllReservationDetails() {
        return reservationDetailService.getAllReservationDetails();
    }

    @GetMapping("/{reservationId}/{badmintonCourtId}")
    public ReservationDetailResponse getReservationDetail(@PathVariable String reservationId,
            @PathVariable String badmintonCourtId) {
        return reservationDetailService.getReservationDetail(reservationId, badmintonCourtId);
    }

    @PostMapping
    public ReservationDetailResponse createReservationDetail(@RequestBody ReservationDetailRequest dto) {
        return reservationDetailService.createReservationDetail(dto);
    }

    @PutMapping("/{reservationId}/{badmintonCourtId}")
    public ReservationDetailResponse updateReservationDetail(@PathVariable String reservationId,
            @PathVariable String badmintonCourtId,
            @RequestBody ReservationDetailRequest dto) {
        return reservationDetailService.updateReservationDetail(reservationId, badmintonCourtId, dto);
    }

    @DeleteMapping("/{reservationId}/{badmintonCourtId}")
    public void deleteReservationDetail(@PathVariable String reservationId, @PathVariable String badmintonCourtId) {
        reservationDetailService.deleteReservationDetail(reservationId, badmintonCourtId);
    }

    @GetMapping("/court/{courtId}/today")
    public List<ReservationDetailResponse> getTodayByCourt(@PathVariable String courtId) {
        LocalDate today = LocalDate.now();
        return reservationDetailService.getByCourtAndDate(courtId, today);
    }

    @GetMapping("/court/{courtId}/notCancel/today")
    public List<ReservationDetailResponse> getTodayByCourtNoCancel(@PathVariable String courtId) {
        LocalDate today = LocalDate.now();
        return reservationDetailService.getByCourtAndDateNotStatusCancel(courtId, today);
    }

}
