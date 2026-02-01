package com.bcb.backend.mysql.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PriceTypeRequest {
	private String type; // "Vãng lai" hoặc "Cố định"
}
