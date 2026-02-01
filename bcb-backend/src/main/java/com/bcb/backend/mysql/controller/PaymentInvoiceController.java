package com.bcb.backend.mysql.controller;

import com.bcb.backend.mysql.dto.request.PaymentInvoiceRequest;
import com.bcb.backend.mysql.dto.request.PaymentStatusUpdateRequest;
import com.bcb.backend.mysql.dto.response.PaymentInvoiceResponse;
import com.bcb.backend.mysql.service.PaymentInvoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class PaymentInvoiceController {

	private final PaymentInvoiceService paymentService;

	@GetMapping
	public List<PaymentInvoiceResponse> getAllPayments() {
		return paymentService.getAllPayments();
	}

	@GetMapping("/{id}")
	public ResponseEntity<PaymentInvoiceResponse> getPaymentById(@PathVariable String id) {
		return ResponseEntity.ok(paymentService.getPaymentById(id));
	}

	@PostMapping
	public ResponseEntity<PaymentInvoiceResponse> createPayment(@RequestBody PaymentInvoiceRequest dto) {
		PaymentInvoiceResponse response = paymentService.createPayment(dto);
		return ResponseEntity.ok(response);
	}

	@GetMapping("/branch/{branchId}")
	public List<PaymentInvoiceResponse> getByBranch(@PathVariable String branchId) {
		return paymentService.getInvoicesByBranchId(branchId);
	}

	@PutMapping("/{id}/status")
	public ResponseEntity<PaymentInvoiceResponse> updatePaymentStatus(
			@PathVariable String id,
			@RequestBody PaymentStatusUpdateRequest request) {
		PaymentInvoiceResponse updatedPayment = paymentService.updatePaymentStatus(id, request.getPaymentStatus());
		return ResponseEntity.ok(updatedPayment);
	}

}