package com.bcb.backend.mysql.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bcb.backend.mysql.dto.request.ReviewRequeset;
import com.bcb.backend.mysql.dto.response.ReviewResponse;
import com.bcb.backend.mysql.service.ReviewService;
import com.bcb.backend.util.JwtUtil;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@CrossOrigin
@RequestMapping("/reviews")
public class ReviewController {

    private final ReviewService reviewService;
    private JwtUtil jwtUtil;

    public ReviewController(ReviewService reviewService, JwtUtil jwtUtil) {
        this.reviewService = reviewService;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping("/branch/{id}")
    public ResponseEntity<?> getAllReviewsofBranch(@PathVariable String id) {
        return ResponseEntity.ok(reviewService.getAllReviewsOfBranch(id));
    }

    @GetMapping("/user")
    public ResponseEntity<?> getAllReviewsofUser(HttpServletRequest httpRequest) {

        String authHeader = httpRequest.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);

            String accountId = jwtUtil.extractAccountId(token);

            return ResponseEntity.ok(reviewService.getAllReviewsofUser(accountId));

        }

        return ResponseEntity.badRequest().body("Invalid authorization.");
    }

    @PostMapping
    public ResponseEntity<?> createReview(@RequestBody ReviewRequeset request) {
        return ResponseEntity.ok(reviewService.createReview(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateReview(@PathVariable String id, @RequestBody ReviewRequeset requeset) {

        ReviewResponse response = reviewService.updateReview(id, requeset);

        if (response == null) {
            return ResponseEntity.badRequest().body("Review not found");
        }

        return ResponseEntity.ok(response);

    }
}
