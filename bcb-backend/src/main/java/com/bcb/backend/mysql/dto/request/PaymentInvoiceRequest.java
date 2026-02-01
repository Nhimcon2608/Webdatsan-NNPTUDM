package com.bcb.backend.mysql.dto.request;

import lombok.Data;

@Data
public class PaymentInvoiceRequest {
	private String reservationId;
	private String paymentStatus;
}
