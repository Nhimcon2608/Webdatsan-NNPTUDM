package com.bcb.backend.mysql.model;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "price")
public class Price {

	@Id
	@Column(name = "id")
	private String id;

	@Column(name = "start_time")
	private short startTime;

	@Column(name = "end_time")
	private short endTime;

	@Column(name = "day_of_week")
	private String dayOfWeek;

	@Column(name = "price_per_hour")
	private BigDecimal pricePerHour;

	@ManyToOne
	@JoinColumn(name = "branch_id")
	private Branch branch;

	@ManyToOne
	@JoinColumn(name = "price_type_id")
	private PriceType priceType;
}
