package com.bcb.backend.mongo.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.bcb.backend.mongo.model.BranchDescription;

public interface BranchDescriptionRepository extends MongoRepository<BranchDescription, String> {
        
}