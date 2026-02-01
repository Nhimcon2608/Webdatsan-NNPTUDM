package com.bcb.backend.mysql.dto.request;

import lombok.*;
import jakarta.validation.constraints.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateBranchRequest {

	@NotNull(message = "Tên chi nhánh không được để trống")
	private String branchName;

	@Email(message = "Email không hợp lệ")
	private String email;

	@NotNull(message = "Địa chỉ không được để trống")
	private String address;

	private String bankName;

	private String bankNumber;

	private AccountRequest accountRequest;

	private String partnershipRequestId;
}
