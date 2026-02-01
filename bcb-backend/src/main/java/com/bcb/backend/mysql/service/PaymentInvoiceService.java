package com.bcb.backend.mysql.service;

import com.bcb.backend.mysql.dto.request.PaymentInvoiceRequest;
import com.bcb.backend.mysql.dto.response.PaymentInvoiceResponse;
import com.bcb.backend.mysql.mapper.PaymentInvoiceMapper;
import com.bcb.backend.mysql.model.PaymentInvoice;
import com.bcb.backend.mysql.model.Reservation;
// import com.bcb.backend.mysql.model.ReservationDetail;
import com.bcb.backend.mysql.repository.PaymentInvoiceRepository;
import com.bcb.backend.mysql.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentInvoiceService {

	private final PaymentInvoiceRepository paymentRepository;
	private final ReservationRepository reservationRepository;

	public List<PaymentInvoiceResponse> getAllPayments() {
		return paymentRepository.findAll().stream()
				.map(PaymentInvoiceMapper::toDTO)
				.collect(Collectors.toList());
	}

	public PaymentInvoiceResponse getPaymentById(String id) {
		PaymentInvoice payment = paymentRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Payment not found"));
		return PaymentInvoiceMapper.toDTO(payment);
	}

	public PaymentInvoiceResponse createPayment(PaymentInvoiceRequest dto) {
		Reservation reservation = reservationRepository.findById(dto.getReservationId())
				.orElseThrow(() -> new RuntimeException("Reservation not found"));

		if (!"checked".equals(reservation.getStatus())) {
			throw new RuntimeException("Reservation must be checked to create invoice");
		}

		boolean exists = paymentRepository.existsByReservation_Id(dto.getReservationId());
		if (exists) {
			throw new RuntimeException("Invoice already exists for this reservation");
		}

		PaymentInvoice payment = PaymentInvoice.builder()
				.id(GenerationId.generateId("paym"))
				.reservation(reservation)
				.total(reservation.getTotalPrice())
				.paymentStatus("PENDING") // Thêm status mặc định
				.build();

		reservation.getReservationDetails().forEach(detail -> {
			detail.getBadmintonCourt().setAvailable(true);
		});

		return PaymentInvoiceMapper.toDTO(paymentRepository.save(payment));
	}

	public List<PaymentInvoiceResponse> getInvoicesByBranchId(String branchId) {
		return paymentRepository.findAllByReservation_ReservationDetails_BadmintonCourt_Branch_Id(branchId)
				.stream()
				.map(PaymentInvoiceMapper::toDTO)
				.collect(Collectors.toList());
	}

	public PaymentInvoiceResponse updatePaymentStatus(String id, String status) {
		PaymentInvoice payment = paymentRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Payment not found"));

		payment.setPaymentStatus(status);
		return PaymentInvoiceMapper.toDTO(paymentRepository.save(payment));
	}
}
