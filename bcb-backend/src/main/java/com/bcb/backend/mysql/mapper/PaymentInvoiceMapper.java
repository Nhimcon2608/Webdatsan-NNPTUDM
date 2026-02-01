package com.bcb.backend.mysql.mapper;

import com.bcb.backend.mysql.dto.request.PaymentInvoiceRequest;
import com.bcb.backend.mysql.dto.response.PaymentInvoiceResponse;
import com.bcb.backend.mysql.model.PaymentInvoice;
import com.bcb.backend.mysql.model.Reservation;

public class PaymentInvoiceMapper {

	public static PaymentInvoiceResponse toDTO(PaymentInvoice payment) {
		Reservation reservation = payment.getReservation();

		return PaymentInvoiceResponse.builder()
				.id(payment.getId())
				.createAt(payment.getCreateAt())
				.total(payment.getTotal())
				.paymentStatus(payment.getPaymentStatus())
				.deposit(reservation.getDeposit())
				.remain(payment.getTotal().subtract(reservation.getDeposit()))
				.reservationId(payment.getReservation() != null ? payment.getReservation().getId() : null)
				.build();
	}

	public static PaymentInvoice toEntity(PaymentInvoiceRequest dto, Reservation reservation) {
		return PaymentInvoice.builder()
				.reservation(reservation)
				.build();

	}
}
