package com.bcb.backend.mysql.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bcb.backend.mysql.dto.request.GetTotalPrice;
import com.bcb.backend.mysql.dto.request.PriceRequest;
import com.bcb.backend.mysql.service.PriceService;

@RestController
@RequestMapping("/prices")
@CrossOrigin
public class PriceController {

	private final PriceService priceService;

	public PriceController(PriceService priceService) {
		this.priceService = priceService;
	}

	@GetMapping("/branch/{branchId}")
	public ResponseEntity<?> getPricesByBranchId(@PathVariable String branchId) {
		return ResponseEntity.ok(priceService.getPricesByBranchId(branchId));
	}

	@GetMapping("/branch/{branchId}/price-type/{priceTypeId}")
	public ResponseEntity<?> getPricesByBranchAndPriceType(
			@PathVariable String branchId,
			@PathVariable String priceTypeId) {
		return ResponseEntity.ok(priceService.getPricesByBranchAndPriceType(branchId, priceTypeId));
	}

	@GetMapping("/branch/{branchId}/all-types")
	public ResponseEntity<?> getAllPriceTypesByBranch(@PathVariable String branchId) {
		return ResponseEntity.ok(priceService.getAllPriceTypesByBranch(branchId));
	}

	@GetMapping("/{id}")
	public ResponseEntity<?> getPriceById(@PathVariable String id) {
		return ResponseEntity.ok(priceService.getPriceById(id));
	}

	@PostMapping
	public ResponseEntity<?> createPrice(@RequestBody PriceRequest priceRequset) {
		return ResponseEntity.ok(priceService.createPrice(priceRequset));
	}

	@PutMapping("/{id}")
	public ResponseEntity<?> updatePrice(@PathVariable String id, @RequestBody PriceRequest priceRequest) {
		return ResponseEntity.ok(priceService.updatePrice(id, priceRequest));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<?> deletePrice(@PathVariable String id) {
		return ResponseEntity.ok(priceService.deletePrice(id));
	}

	@GetMapping("/price-of/{branchId}")
	public ResponseEntity<?> getTotalPrice(@PathVariable String branchId, @RequestBody GetTotalPrice getTotalPrice) {
		return ResponseEntity
				.ok(priceService.prepareTheBill(getTotalPrice.getStart(), getTotalPrice.getRentalTime(), branchId));
	}
}