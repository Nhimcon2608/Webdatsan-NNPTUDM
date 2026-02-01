package com.bcb.backend.mysql.service;

import com.bcb.backend.mysql.dto.request.PriceTypeRequest;
import com.bcb.backend.mysql.dto.response.PriceTypeResponse;
import com.bcb.backend.mysql.mapper.PriceTypeMapper;
import com.bcb.backend.mysql.model.PriceType;
import com.bcb.backend.mysql.repository.PriceTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PriceTypeService {

	private final PriceTypeRepository priceTypeRepository;
	private final PriceTypeMapper priceTypeMapper;

	private static final List<String> VALID_TYPES = List.of("Vãng lai", "Cố định");

	public PriceTypeResponse create(PriceTypeRequest request) {
		if (!VALID_TYPES.contains(request.getType())) {
			throw new IllegalArgumentException("Loại giá không hợp lệ! Chỉ chấp nhận: Vãng lai hoặc Cố định");
		}

		// Nếu loại giá đã tồn tại, không cho tạo lại
		if (priceTypeRepository.findByType(request.getType()).isPresent()) {
			throw new IllegalArgumentException("Loại giá này đã tồn tại!");
		}

		PriceType priceType = priceTypeMapper.toEntity(request);
		priceType.setId(GenerationId.generateId("type"));
		priceTypeRepository.save(priceType);
		return priceTypeMapper.toResponse(priceType);
	}

	public List<PriceTypeResponse> getAll() {
		return priceTypeRepository.findAll().stream()
				.map(priceTypeMapper::toResponse)
				.collect(Collectors.toList());
	}

	public PriceTypeResponse getById(String id) {
		PriceType priceType = priceTypeRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Không tìm thấy loại giá"));
		return priceTypeMapper.toResponse(priceType);
	}

	public void delete(String id) {
		priceTypeRepository.deleteById(id);
	}
}
