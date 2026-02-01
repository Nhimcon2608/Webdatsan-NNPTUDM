package com.bcb.backend.mysql.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BranchGetAllResponse {

	private String id;
	private String branchName;
	private String email;
	private String address;
	private String phoneNumber;
	private String imagePath;
	private boolean isCooperated;
}
