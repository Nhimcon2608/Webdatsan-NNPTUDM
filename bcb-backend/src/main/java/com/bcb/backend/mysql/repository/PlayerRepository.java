package com.bcb.backend.mysql.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bcb.backend.mysql.model.Player;

public interface PlayerRepository extends JpaRepository<Player, String> {
    public Optional<Player> findByAccountId(String accountId);
}
