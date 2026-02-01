package com.bcb.backend.mongo.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.bcb.backend.mongo.model.ReviewContent;

public interface ReviewContentReposirory extends MongoRepository<ReviewContent, String> {
    
}
