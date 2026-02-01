package com.bcb.backend.mysql.dto.response;

import java.util.List;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BranchResponse {

	private String id;
	private String branchName;
	private String email;
	private String phoneNumber;
	private String imagePath;
	private String address;
	private String bankName;
	private String bankNumber;
	private boolean isCooperated;
	private String description;

	private List<PriceResponse> prices;
}