package com.bcb.backend.mongo.service;

import org.springframework.stereotype.Service;

import com.bcb.backend.mongo.model.BranchDescription;
import com.bcb.backend.mongo.repository.BranchDescriptionRepository;

@Service
public class BranchDescriptionService {

    private final BranchDescriptionRepository branchDescriptionRepo;

    public BranchDescriptionService(BranchDescriptionRepository branchDescriptionRepo) {
        this.branchDescriptionRepo = branchDescriptionRepo;
    }

    public void createDescription(String id) {
        
        BranchDescription description = BranchDescription.builder()
                                            .id(id)
                                            .content("")
                                            .build();

        branchDescriptionRepo.save(description);
    }

    public String getContentById(String id) {
        return branchDescriptionRepo.findById(id)
                .map(BranchDescription::getContent)
                .orElseThrow(() -> new IllegalArgumentException("Description not found with id: " + id));
    }

    public void setContentById(String id, String content) {

        BranchDescription branch = branchDescriptionRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Branch not found with id: " + id));

        branch.setContent(content);

        branchDescriptionRepo.save(branch);
    }

}
