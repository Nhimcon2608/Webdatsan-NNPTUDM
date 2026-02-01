package com.bcb.backend.mysql.mapper;

import com.bcb.backend.mysql.dto.request.PriceTypeRequest;
import com.bcb.backend.mysql.dto.response.PriceTypeResponse;
import com.bcb.backend.mysql.model.PriceType;
import org.springframework.stereotype.Component;

@Component
public class PriceTypeMapper {

	public PriceType toEntity(PriceTypeRequest request) {
		PriceType priceType = new PriceType();
		priceType.setType(request.getType());
		return priceType;
	}

	public PriceTypeResponse toResponse(PriceType entity) {
		return PriceTypeResponse.builder()
				.id(entity.getId())
				.type(entity.getType())
				.build();
	}
}
