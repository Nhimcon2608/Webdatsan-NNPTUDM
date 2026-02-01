package com.bcb.backend.mysql.service;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

@Service
public class TokenBlacklistService {

    private StringRedisTemplate redisTemplate;

    public TokenBlacklistService(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public void blacklistToken(String token, Date expiration) {
        long ttlMillis = expiration.getTime() - System.currentTimeMillis();

        if (ttlMillis > 0) {
            redisTemplate.opsForValue().set(token, "blacklisted", ttlMillis, TimeUnit.MILLISECONDS);
        }
    }

    public boolean isTokenBlacklisted(String token) {
        return Boolean.TRUE.equals(redisTemplate.hasKey(token));
    }

    public Map<String, Long> getAllBlacklistedTokens() {
        Set<String> tokens = redisTemplate.keys("*");
        Map<String, Long> tokenWithTTL = new HashMap<>();

        if (tokens != null) {
            for (String token : tokens) {
                Long ttl = redisTemplate.getExpire(token, TimeUnit.MILLISECONDS);
                tokenWithTTL.put(token, ttl != null ? ttl : -1); // -1 nếu không có TTL
            }
        }

        return tokenWithTTL;
    }
}
