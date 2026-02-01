package com.bcb.backend.mysql.dto.request;

// import jakarta.validation.constraints.Email;
// import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateBranchRequest {

	private String branchName;
	private String email;
	private String address;
	private String bankName;
	private String bankNumber;
	private String description;
}
