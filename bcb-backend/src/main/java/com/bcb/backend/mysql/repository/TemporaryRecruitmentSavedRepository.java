package com.bcb.backend.mysql.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bcb.backend.mysql.model.TemporaryRecruitmentSaved;
import com.bcb.backend.mysql.model.TemporaryRecruitmentSavedId;

public interface TemporaryRecruitmentSavedRepository
                extends JpaRepository<TemporaryRecruitmentSaved, TemporaryRecruitmentSavedId> {

        List<TemporaryRecruitmentSaved> findByPlayerId(String playerId);

        Optional<TemporaryRecruitmentSaved> findByIdTemporaryRecruitmentIdAndIdPlayerId(
                        String temporaryRecruitmentId,
                        String playerId);
}
