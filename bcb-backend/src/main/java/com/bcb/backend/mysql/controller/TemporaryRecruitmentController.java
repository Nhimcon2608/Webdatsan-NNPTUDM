package com.bcb.backend.mysql.controller;

import java.util.Date;
import java.util.Map;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.bcb.backend.mysql.dto.request.TemporaryRecruitmentRequest;
import com.bcb.backend.mysql.dto.response.PaginationResponse;
import com.bcb.backend.mysql.dto.response.TemporaryRecruitmentCompactResponse;
import com.bcb.backend.mysql.dto.response.TemporaryRecruitmentDetailResponse;
import com.bcb.backend.mysql.dto.response.TemporaryRecruitmentResponse;
import com.bcb.backend.mysql.service.TemporaryRecruitmentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/temporary-recruitments")
@RequiredArgsConstructor
public class TemporaryRecruitmentController {

    private final TemporaryRecruitmentService temporaryRecruitmentService;

    @PreAuthorize("isAuthenticated()")
    @PostMapping
    public ResponseEntity<TemporaryRecruitmentCompactResponse> create(
            @RequestBody TemporaryRecruitmentRequest request) {
        TemporaryRecruitmentCompactResponse response = temporaryRecruitmentService.createTemporaryRecruitment(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Get all temporary recruitments with pagination
     * 
     * @param page          page number (0-indexed), default is 0
     * @param size          page size, default is 10, max is 100
     * @param sortBy        field to sort by, default is "createAt"
     * @param sortDirection sort direction (ASC/DESC), default is DESC
     * @return paginated response
     */
    @GetMapping
    public ResponseEntity<PaginationResponse<TemporaryRecruitmentCompactResponse>> getAll(
            @RequestParam(required = false, defaultValue = "all") String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDirection,

            @RequestParam(required = false) String searchByName,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Date createdDateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Date createdDateTo,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Date recruitmentDateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Date recruitmentDateTo,
            @RequestParam(required = false) Integer quantityMin, @RequestParam(required = false) Integer quantityMax) {

        PaginationResponse<TemporaryRecruitmentCompactResponse> response = temporaryRecruitmentService.getAll(status,
                page, size, sortBy, sortDirection, searchByName,
                createdDateFrom, createdDateTo, recruitmentDateFrom, recruitmentDateTo, quantityMin, quantityMax);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TemporaryRecruitmentDetailResponse> getById(@PathVariable String id) {
        TemporaryRecruitmentDetailResponse response = temporaryRecruitmentService.getById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/full-infor/{id}")
    public ResponseEntity<TemporaryRecruitmentResponse> getFullInforById(@PathVariable String id) {
        TemporaryRecruitmentResponse response = temporaryRecruitmentService.getFullInforById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/by-reservation/{id}")
    public ResponseEntity<?> getByReservationId(@PathVariable String id) {
        return ResponseEntity.ok(temporaryRecruitmentService.getByReservationId(id));
    }

    @PreAuthorize("isAuthenticated()")
    @PutMapping("/{id}")
    public ResponseEntity<TemporaryRecruitmentCompactResponse> update(
            @PathVariable String id,
            @RequestBody TemporaryRecruitmentRequest request) {
        TemporaryRecruitmentCompactResponse response = temporaryRecruitmentService.update(id, request);
        return ResponseEntity.ok(response);
    }

    @PreAuthorize("isAuthenticated()")
    @PatchMapping("/{id}")
    public ResponseEntity<TemporaryRecruitmentCompactResponse> changeStatus(
            @PathVariable String id,
            @RequestBody Map<String, Boolean> request) {

        TemporaryRecruitmentCompactResponse response = temporaryRecruitmentService.changeStatus(id,
                request.get("available"));
        return ResponseEntity.ok(response);
    }

    @PreAuthorize("isAuthenticated()")
    // @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        temporaryRecruitmentService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
