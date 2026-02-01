package com.bcb.backend.mysql.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.bcb.backend.mysql.service.TemporaryRegistrationService;
import com.bcb.backend.util.HttpServletRequestUtil;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/temporary-registrations")
@RequiredArgsConstructor
public class TemporaryRegistrationController {

    private final TemporaryRegistrationService temporaryRegistrationService;
    private final HttpServletRequestUtil requestUtil;

    @PostMapping
    public ResponseEntity<?> create(HttpServletRequest httpRequest,
            @RequestBody Map<String, String> requestId) {

        String accountId = requestUtil.extractAccountId(httpRequest);

        if (accountId != null) {
            return ResponseEntity
                    .ok(temporaryRegistrationService.create(accountId, requestId.get("temporaryRecruitmentId")));
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
                    .ok(temporaryRegistrationService.getAllTemporaryRecruitmentSavedOfPlayer(accountId));
        } else {
            return ResponseEntity.badRequest().body("Invalid authorization.");

        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> delete(HttpServletRequest httpRequest, @PathVariable(name = "id") String id) {

        String accountId = requestUtil.extractAccountId(httpRequest);

        if (accountId != null) {
            temporaryRegistrationService.delete(accountId, id);
            return ResponseEntity.ok().body(null);
        } else {
            return ResponseEntity.badRequest().body("Invalid authorization.");

        }

    }

}
