package com.bcb.backend.mysql.controller;

import com.bcb.backend.mysql.dto.request.BadmintonCourtRequest;
import com.bcb.backend.mysql.dto.request.UpdateCourtStatusRequest;
import com.bcb.backend.mysql.dto.response.BadmintonCourtResponse;
import com.bcb.backend.mysql.model.BadmintonCourt;
import com.bcb.backend.mysql.service.BadmintonCourtService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/badminton-courts")
@RequiredArgsConstructor
public class BadmintonCourtController {

    private final BadmintonCourtService badmintonCourtService;

    @PostMapping
    public ResponseEntity<BadmintonCourtResponse> create(@RequestBody BadmintonCourtRequest request) {
        return ResponseEntity.ok(badmintonCourtService.create(request));
    }

    @GetMapping
    public ResponseEntity<List<BadmintonCourtResponse>> getAll() {
        return ResponseEntity.ok(badmintonCourtService.getAll());
    }

    @GetMapping("branch/{branchId}/{status}")
    public ResponseEntity<?> getAllCourtsOfBranchByStatus(@PathVariable String branchId, @PathVariable String status) {
        return ResponseEntity.ok(badmintonCourtService.getAllCourtsOfBranchByStatus(branchId, status));
    }
    
    @GetMapping("/branch/{branchId}")
    public ResponseEntity<List<BadmintonCourtResponse>> getAllCourtsOfBranch(@PathVariable String branchId) {
        return ResponseEntity.ok(badmintonCourtService.getAllCourtsOfBranch(branchId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BadmintonCourtResponse> getById(@PathVariable String id) {
        return ResponseEntity.ok(badmintonCourtService.getById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BadmintonCourtResponse> update(
            @PathVariable String id,
            @RequestBody BadmintonCourtRequest request) {
        return ResponseEntity.ok(badmintonCourtService.update(id, request));
    }

    @GetMapping("/manager/{accountId}")
    public ResponseEntity<List<BadmintonCourtResponse>> getCourtsByManager(@PathVariable String accountId) {
        return ResponseEntity.ok(badmintonCourtService.getCourtsByManager(accountId));
    }

    // Chỉ dùng nếu thực sự cần model gốc, nếu không nên xóa
    @GetMapping("/all")
    public ResponseEntity<List<BadmintonCourt>> getAllCourts() {
        return ResponseEntity.ok(badmintonCourtService.getAllCourts());
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<BadmintonCourtResponse> updateStatus(
            @PathVariable String id,
            @RequestBody UpdateCourtStatusRequest request) {
        return ResponseEntity.ok(badmintonCourtService.updateStatus(id, request));
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<Void> toggleCourtAvailability(@PathVariable String id) {
        badmintonCourtService.toggleAvailability(id);
        return ResponseEntity.ok().build();
    }
}
