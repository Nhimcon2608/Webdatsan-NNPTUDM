package com.bcb.backend.mysql.dto.request;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChangeStatusOfReservationRequest {
	List<String> reservationIds;
	String status;
}
