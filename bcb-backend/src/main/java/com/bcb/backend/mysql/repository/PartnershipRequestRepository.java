package com.bcb.backend.mysql.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bcb.backend.mysql.model.PartnershipRequest;

public interface PartnershipRequestRepository extends JpaRepository<PartnershipRequest, String> {
       
}
