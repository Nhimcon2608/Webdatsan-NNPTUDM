package com.bcb.backend.mysql.dto.request;

import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class UpdatePhoneRequest {
	@Pattern(regexp = "^\\d{10}$", message = "Số điện thoại phải có 10 chữ số")
	private String phoneNumber;
}
