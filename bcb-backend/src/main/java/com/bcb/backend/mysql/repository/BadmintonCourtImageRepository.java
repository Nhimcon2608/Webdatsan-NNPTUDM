package com.bcb.backend.mysql.repository;

import com.bcb.backend.mysql.model.BadmintonCourtImage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BadmintonCourtImageRepository extends JpaRepository<BadmintonCourtImage, String> {
}
