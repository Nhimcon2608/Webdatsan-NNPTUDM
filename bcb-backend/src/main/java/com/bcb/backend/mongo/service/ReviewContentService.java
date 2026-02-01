package com.bcb.backend.mongo.service;

import org.springframework.stereotype.Service;

import com.bcb.backend.mongo.model.ReviewContent;
import com.bcb.backend.mongo.repository.ReviewContentReposirory;

@Service
public class ReviewContentService {

    private final ReviewContentReposirory reviewContentRepo;

    public ReviewContentService(ReviewContentReposirory reviewContentRepo) {
        this.reviewContentRepo = reviewContentRepo;
    }

    public String createDescription(String id, String content) {

        ReviewContent review = ReviewContent.builder()
                .id(id)
                .content(content)
                .build();

        return reviewContentRepo.save(review).getContent();
    }

    public String getContentById(String id) {
        return reviewContentRepo.findById(id)
                .map(ReviewContent::getContent)
                .orElseThrow(() -> new IllegalArgumentException("Description not found with id: " + id));
    }

    public String editContent(String id, String content) {
        ReviewContent review = reviewContentRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Review not found"));

        review.setContent(content);

        return reviewContentRepo.save(review).getContent();

    }

}
