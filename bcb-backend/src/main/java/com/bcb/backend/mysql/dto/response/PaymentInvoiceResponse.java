package com.bcb.backend.mysql.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.Date;

@Data
@Builder
public class PaymentInvoiceResponse {
	private String id;
	private Date createAt;
	private BigDecimal total;
	private BigDecimal deposit;
	private BigDecimal remain;
	private String reservationId;
	private String paymentStatus;

	private ReservationResponseDTO reservation;

}