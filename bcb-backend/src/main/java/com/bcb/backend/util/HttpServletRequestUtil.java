package com.bcb.backend.util;

import org.springframework.stereotype.Component;
import jakarta.servlet.http.HttpServletRequest;

@Component
public class HttpServletRequestUtil {

    private final JwtUtil jwtUtil;

    public HttpServletRequestUtil(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    public String extractAccountId(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            return jwtUtil.extractAccountId(token);
        }

        return null;
    }
}
