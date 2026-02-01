package com.bcb.backend.mysql.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bcb.backend.mysql.model.Review;

public interface ReviewRepository extends JpaRepository<Review, String> {
    
}
