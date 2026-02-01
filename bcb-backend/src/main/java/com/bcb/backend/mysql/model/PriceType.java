package com.bcb.backend.mysql.model;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.Data;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "price_type")
public class PriceType {

	@Id
	@Column(name = "id")
	private String id;

	@Column(name = "type")
	private String type;

	@OneToMany(mappedBy = "priceType")
	@Builder.Default
	private List<Price> prices = new ArrayList<>();
}
