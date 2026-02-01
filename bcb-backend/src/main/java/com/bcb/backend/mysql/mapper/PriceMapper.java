package com.bcb.backend.mysql.mapper;

import com.bcb.backend.mysql.dto.request.PriceRequest;
import com.bcb.backend.mysql.dto.response.PriceResponse;
import com.bcb.backend.mysql.model.Price;

public class PriceMapper {

	public static PriceResponse toDTO(Price entity) {
		return PriceResponse.builder()
				.id(entity.getId())
				.startTime(entity.getStartTime())
				.endTime(entity.getEndTime())
				.dayOfWeek(entity.getDayOfWeek())
				.pricePerHour(entity.getPricePerHour())
				.branchId(entity.getBranch() != null ? entity.getBranch().getId() : null)
				.branchName(entity.getBranch() != null ? entity.getBranch().getBranchName() : null)
				.priceTypeId(entity.getPriceType() != null ? entity.getPriceType().getId() : null)
				.priceTypeName(entity.getPriceType() != null ? entity.getPriceType().getType() : null)
				.build();
	}

	public static Price toEntity(PriceRequest dto) {
		return Price.builder()
				.startTime(dto.getStartTime())
				.endTime(dto.getEndTime())
				.dayOfWeek(dto.getDayOfWeek())
				.pricePerHour(dto.getPricePerHour())
				.build();
	}
}