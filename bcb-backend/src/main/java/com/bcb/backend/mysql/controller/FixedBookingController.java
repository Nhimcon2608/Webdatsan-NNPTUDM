package com.bcb.backend.mysql.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bcb.backend.mysql.dto.request.ChangeStatusOfReservationRequest;
import com.bcb.backend.mysql.dto.request.FixedBookingRequest;
import com.bcb.backend.mysql.service.FixedBookingService;
import com.bcb.backend.util.HttpServletRequestUtil;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@CrossOrigin
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()")
@RequestMapping("/fixed-booking")
public class FixedBookingController {

	private final HttpServletRequestUtil requestUtil;
	private final FixedBookingService fixedBookingService;

	@PostMapping
	public ResponseEntity<?> create(HttpServletRequest httpRequest,
			@RequestBody FixedBookingRequest fixedBookingRequest) {

		String accountId = requestUtil.extractAccountId(httpRequest);

		if (accountId != null) {
			return ResponseEntity.ok(fixedBookingService.createFixedBooking(accountId, fixedBookingRequest));
		} else {
			return ResponseEntity.badRequest().body("Invalid authorization.");
		}

	}

	@PatchMapping
	public ResponseEntity<?> changeStatus(HttpServletRequest httpRequest,
			@RequestBody ChangeStatusOfReservationRequest request) {

		String accountId = requestUtil.extractAccountId(httpRequest);

		if (accountId != null) {
			return ResponseEntity
					.ok(fixedBookingService.changeStatus(request.getReservationIds(), request.getStatus()));
		} else {
			return ResponseEntity.badRequest().body("Invalid authorization.");
		}

	}
}
