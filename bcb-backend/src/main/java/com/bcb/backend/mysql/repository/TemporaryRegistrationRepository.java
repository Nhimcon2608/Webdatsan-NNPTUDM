package com.bcb.backend.mysql.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bcb.backend.mysql.model.TemporaryRegistration;
import com.bcb.backend.mysql.model.TemporaryRegistrationId;

public interface TemporaryRegistrationRepository extends JpaRepository<TemporaryRegistration, TemporaryRegistrationId> {

    List<TemporaryRegistration> findByPlayerId(String playerId);

    Optional<TemporaryRegistration> findByIdTemporaryRecruitmentIdAndIdPlayerId(
            String temporaryRecruitmentId,
            String playerId);
}
