package com.bcb.backend.mysql.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.bcb.backend.mysql.model.PriceType;

public interface PriceTypeRepository extends JpaRepository<PriceType, String> {
	Optional<PriceType> findByType(String type);
}
