package com.bcb.backend.mongo.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bcb.backend.mongo.model.TemporaryRecruitmentContent;
import com.bcb.backend.mongo.repository.TemporaryRecruitmentContentRepository;

@Service
@Transactional
public class TemporaryRecruitmentContentService {

    private final TemporaryRecruitmentContentRepository temporaryRecruitmentRepository;

    public TemporaryRecruitmentContentService(TemporaryRecruitmentContentRepository temporaryRecruitmentRepository) {
        this.temporaryRecruitmentRepository = temporaryRecruitmentRepository;
    }

    public String createContent(String id, String content) {
        TemporaryRecruitmentContent tr = TemporaryRecruitmentContent.builder()
                .id(id)
                .content(content)
                .build();

        return temporaryRecruitmentRepository.save(tr).getContent();
    }

    public String getContent(String id) {
        return temporaryRecruitmentRepository.findById(id)
                .map(TemporaryRecruitmentContent::getContent)
                .orElse("");
    }

    public String editContent(String id, String content) {
        if (!temporaryRecruitmentRepository.existsById(id)) {
            this.createContent(id, content);
            return content;
        }

        TemporaryRecruitmentContent updated = TemporaryRecruitmentContent.builder()
                .id(id)
                .content(content)
                .build();

        return temporaryRecruitmentRepository.save(updated).getContent();
    }

}
