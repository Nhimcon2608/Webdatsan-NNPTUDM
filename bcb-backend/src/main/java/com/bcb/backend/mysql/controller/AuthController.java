package com.bcb.backend.mysql.controller;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bcb.backend.mysql.dto.request.AccountRequest;
import com.bcb.backend.mysql.dto.request.AuthRequest;
import com.bcb.backend.mysql.dto.response.BlacklistedTokenInfo;
import com.bcb.backend.mysql.service.AccountService;
import com.bcb.backend.mysql.service.TokenBlacklistService;
import com.bcb.backend.util.JwtUtil;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AccountService accountService;
    private AuthenticationManager authenticationManager;
    private JwtUtil jwtUtil;
    private UserDetailsService userDetailsService;
    private TokenBlacklistService tokenBlacklistService;

    public AuthController(AccountService accountService, AuthenticationManager authenticationManager,
            JwtUtil jwtUtil, UserDetailsService userDetailsService, TokenBlacklistService tokenBlacklistService) {

        this.accountService = accountService;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
        this.tokenBlacklistService = tokenBlacklistService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> createUserAccount(@RequestBody AccountRequest request) {
        return ResponseEntity.ok(accountService.registerUserAccount(request));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
        } catch (UsernameNotFoundException | BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Sai thông tin đăng nhập");
        }

        boolean isActivated = accountService.isActivatedByUserName(request.getUsername());
        if (!isActivated) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Tài khoản ngưng hoạt độngt");
        }

        final UserDetails userDetails = userDetailsService.loadUserByUsername(request.getUsername());

        String accountId = accountService.getIdByUsername(request.getUsername());

        List<String> roles = userDetails.getAuthorities()
                .stream().map(GrantedAuthority::getAuthority).collect(Collectors.toList());

        final String jwt = jwtUtil.generateToken(userDetails.getUsername(), accountId, roles);

        return ResponseEntity.ok(Map.of("token", jwt));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        Date expiration = jwtUtil.extractExpiration(token);
        tokenBlacklistService.blacklistToken(token, expiration);

        return ResponseEntity.ok("Đăng xuất thành công.");
    }

    @GetMapping("/blacklisted-tokens")
    public ResponseEntity<?> getBlacklistedTokens() {
        Map<String, Long> tokensWithTTL = tokenBlacklistService.getAllBlacklistedTokens();

        List<BlacklistedTokenInfo> response = tokensWithTTL.entrySet().stream()
                .map(entry -> new BlacklistedTokenInfo(entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }
}
