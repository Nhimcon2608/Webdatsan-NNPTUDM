package com.bcb.backend.mysql.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bcb.backend.mysql.model.Owner;

public interface OwnerRepository extends JpaRepository<Owner, String> {
    Optional<Owner> findByEmail(String email);
    Optional<Owner> findByPhoneNumber(String phoneNumber);
    boolean existsByEmail(String email);
    boolean existsByPhoneNumber(String phone);
}
