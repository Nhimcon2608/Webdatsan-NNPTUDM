package com.bcb.backend.mysql.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.bcb.backend.mysql.model.TemporaryRecruitment;

@Repository
public interface TemporaryRecruitmentRepository
        extends JpaRepository<TemporaryRecruitment, String>, JpaSpecificationExecutor<TemporaryRecruitment> {
    Page<TemporaryRecruitment> findByIsAvailable(boolean isAvailable, Pageable pageable);
    List<TemporaryRecruitment> findAllByReservation_Id(String reservationId);
}
