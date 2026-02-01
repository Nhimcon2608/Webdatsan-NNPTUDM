package com.bcb.backend.mysql.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.bcb.backend.mysql.dto.request.PlayerRequest;
import com.bcb.backend.mysql.dto.response.PlayerResponse;
import com.bcb.backend.mysql.mapper.PlayerMapper;
import com.bcb.backend.mysql.model.Account;
import com.bcb.backend.mysql.model.Player;
import com.bcb.backend.mysql.repository.AccountRepository;
import com.bcb.backend.mysql.repository.PlayerRepository;

@Service
public class PlayerService {

    private final PlayerRepository playerRepo;
    private final AccountRepository accountRepo;

    public PlayerService(PlayerRepository playerRepo, AccountRepository accountRepo) {
        this.playerRepo = playerRepo;
        this.accountRepo = accountRepo;
    }

    public List<PlayerResponse> getAllPlayer() {
        return playerRepo.findAll().stream().map(PlayerMapper::toDTO).collect(Collectors.toList());
    }

    public PlayerResponse getPlayerByAccountId(String accountId) {

        Account account = accountRepo.findById(accountId)
                .orElseThrow(() -> new IllegalArgumentException("Dtails Not found with player id: " + accountId));

        Player player = playerRepo.findById(account.getPlayer().getId())
                .orElseThrow(() -> new IllegalArgumentException("Player not found with player id: " + accountId));

        if (account.isActivated() == true) {
            return PlayerMapper.toDTO(player);
        }

        return null;
    }

    public String getPlayerIdByAccountId(String accountId) {
        return playerRepo.findByAccountId(accountId).orElseThrow(() -> new IllegalArgumentException("Invalid authorization")).getId();
    }

    public PlayerResponse updatePlayerInfor(String id, PlayerRequest playerRequest) {

        Player player = playerRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Player not found with id: " + id));

        player.setFullName(playerRequest.getFullName());
        player.setDob(playerRequest.getDob());
        player.setGender(playerRequest.getGender());
        player.setEmail(playerRequest.getEmail());

        return PlayerMapper.toDTO(playerRepo.save(player));
    }

}
