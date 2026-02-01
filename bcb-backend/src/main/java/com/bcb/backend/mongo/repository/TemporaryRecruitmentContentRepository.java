package com.bcb.backend.mongo.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.bcb.backend.mongo.model.TemporaryRecruitmentContent;

public interface TemporaryRecruitmentContentRepository extends MongoRepository<TemporaryRecruitmentContent, String> {

}
