package com.bcb.backend.util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.*;

import java.util.*;
import java.time.Instant;

@Component
public class JwtUtil {

    @Value("${JWT_EXPIRATION_MS}")
    private long jwtExpiration;

    @Value("${JWT_SECRET_KEY}")
    private String secretKey;

    private javax.crypto.SecretKey key;

    @PostConstruct
    public void init() {
        key = Keys.hmacShaKeyFor(secretKey.getBytes());
    }

    public String generateToken(String username, String accountId, List<String> roles) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", roles);
        claims.put("accountId", accountId);
        claims.put("sub", username);

        return Jwts.builder()
                .claims(claims)
                .issuedAt(Date.from(Instant.now()))
                .expiration(Date.from(Instant.now().plusMillis(jwtExpiration)))
                .signWith(key)
                .compact();
    }

    public Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject();
    }

    public String extractAccountId(String token) {
        return extractAllClaims(token).get("accountId", String.class);
    }

    public List<String> extractRoles(String token) {
        Object rolesObject = extractAllClaims(token).get("roles");
        if (rolesObject instanceof List<?>) {
            return ((List<?>) rolesObject).stream()
                    .map(Object::toString)
                    .toList();
        }
        return Collections.emptyList();
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    private boolean isTokenExpired(String token) {
        return extractAllClaims(token).getExpiration().before(new Date());
    }

    public Date extractExpiration(String token) {
        return extractAllClaims(token).getExpiration();
    }
}
