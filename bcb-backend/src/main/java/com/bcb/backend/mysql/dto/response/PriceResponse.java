package com.bcb.backend.mysql.dto.response;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PriceResponse {

	private String id;
	private short startTime;
	private short endTime;
	private String dayOfWeek;
	private BigDecimal pricePerHour;

	private String branchId;
	private String branchName;
	private String priceTypeId;
	private String priceTypeName;
}