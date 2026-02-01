package com.bcb.backend.mysql.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bcb.backend.mysql.model.Price;
import java.util.List;

public interface PriceRepository extends JpaRepository<Price, String> {

	List<Price> findByBranchId(String branchId);

	List<Price> findByBranchIdAndPriceTypeId(String branchId, String priceTypeId);

	List<Price> findByPriceTypeId(String priceTypeId);
}