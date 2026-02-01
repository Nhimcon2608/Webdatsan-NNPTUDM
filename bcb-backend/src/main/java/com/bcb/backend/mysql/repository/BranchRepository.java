package com.bcb.backend.mysql.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.bcb.backend.mysql.model.Branch;

public interface BranchRepository extends JpaRepository<Branch, String> {
	Optional<Branch> findByPartnershipRequestId(String partnershipRequestId);

	Optional<Branch> findByAccountId(String accountId);
}