package com.bcb.backend.mysql.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bcb.backend.mysql.model.Account;

public interface AccountRepository extends JpaRepository<Account, String> {
    public Optional<Account> findByUsername(String username);

    public List<Account> findByPhoneNumber(String numberPhone);
}
