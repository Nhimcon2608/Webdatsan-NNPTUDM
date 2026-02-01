package com.bcb.backend.mysql.controller;

import com.bcb.backend.mysql.dto.request.PriceTypeRequest;
import com.bcb.backend.mysql.dto.response.PriceTypeResponse;
import com.bcb.backend.mysql.service.PriceTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/price-types")
@RequiredArgsConstructor
public class PriceTypeController {

	private final PriceTypeService priceTypeService;

	@PostMapping
	public PriceTypeResponse create(@RequestBody PriceTypeRequest request) {
		return priceTypeService.create(request);
	}

	@GetMapping
	public List<PriceTypeResponse> getAll() {
		return priceTypeService.getAll();
	}

	@GetMapping("/{id}")
	public PriceTypeResponse getById(@PathVariable String id) {
		return priceTypeService.getById(id);
	}

	@DeleteMapping("/{id}")
	public void delete(@PathVariable String id) {
		priceTypeService.delete(id);
	}

}
