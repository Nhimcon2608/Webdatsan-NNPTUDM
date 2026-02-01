package com.bcb.backend.mysql.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bcb.backend.mysql.dto.request.PlayerRequest;
import com.bcb.backend.mysql.service.PlayerService;
import com.bcb.backend.util.JwtUtil;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/players")
@CrossOrigin
public class PlayerController {

    private final PlayerService playerService;
    private final JwtUtil jwtUtil;

    public PlayerController(PlayerService playerService, JwtUtil jwtUtil) {
        this.playerService = playerService;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping
    public ResponseEntity<?> getAllPlayer() {
        return ResponseEntity.ok(playerService.getAllPlayer());
    }

    // @GetMapping("/{id}")
    // public ResponseEntity<?> getPlayerById(@PathVariable String id) {
    // return ResponseEntity.ok(playerService.getPlayerIdByAccountId(id));
    // }

    @GetMapping("account/{accountId}")
    public ResponseEntity<?> getPlayerByAccountId(@PathVariable String accountId) {
        return ResponseEntity.ok(playerService.getPlayerByAccountId(accountId));
    }

    @PutMapping
    public ResponseEntity<?> updatePlayerInfor(HttpServletRequest httpRequest, @RequestBody PlayerRequest request) {

        String authHeader = httpRequest.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);

            String id = jwtUtil.extractAccountId(token);

            return ResponseEntity
                    .ok(playerService.updatePlayerInfor(playerService.getPlayerIdByAccountId(id), request));

        }
        return ResponseEntity.badRequest().body("Invalid authorization");

    }
}
