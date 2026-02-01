package com.bcb.backend.mysql.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bcb.backend.mysql.service.TemporaryRecruitmentSavedService;
import com.bcb.backend.util.HttpServletRequestUtil;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/temporary-recruitments-saved")
@RequiredArgsConstructor
public class TemporaryRecruitmentSavedController {

    private final TemporaryRecruitmentSavedService temporaryRecruitmentSavedService;
    private final HttpServletRequestUtil requestUtil;

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> create(HttpServletRequest httpRequest,
            @RequestBody Map<String, String> requestId) {

        String accountId = requestUtil.extractAccountId(httpRequest);

        if (accountId != null) {
            return ResponseEntity
                    .ok(temporaryRecruitmentSavedService.create(accountId, requestId.get("temporaryRecruitmentId")));
        } else {
            return ResponseEntity.badRequest().body("Invalid authorization.");
        }
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getAllOfUser(HttpServletRequest httpRequest) {

        String accountId = requestUtil.extractAccountId(httpRequest);

        if (accountId != null) {
            return ResponseEntity
                    .ok(temporaryRecruitmentSavedService.getAllTemporaryRecruitmentSavedOfPlayer(accountId));
        } else {
            return ResponseEntity.badRequest().body("Invalid authorization.");

        }

    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> delete(HttpServletRequest httpRequest, @PathVariable(name = "id") String id) {

        String accountId = requestUtil.extractAccountId(httpRequest);

        if (accountId != null) {
            temporaryRecruitmentSavedService.delete(accountId, id);
            return ResponseEntity.ok().body(null);
        } else {
            return ResponseEntity.badRequest().body("Invalid authorization.");

        }

    }

}
