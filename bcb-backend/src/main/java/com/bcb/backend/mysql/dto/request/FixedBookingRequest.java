package com.bcb.backend.mysql.dto.request;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FixedBookingRequest {
	private String branchId;
	private String voucherId;
	private BigDecimal totalPrice;
	private BigDecimal deposit;
	private LocalDate firstWeekDate;
	private List<WeeklySchedule> weeklySchedule;
}
