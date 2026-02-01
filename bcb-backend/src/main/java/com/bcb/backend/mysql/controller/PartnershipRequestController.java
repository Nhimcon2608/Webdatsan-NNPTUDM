package com.bcb.backend.mysql.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.bcb.backend.mysql.dto.request.*;
import com.bcb.backend.mysql.service.PartnershipRequestService;

@RestController
@RequestMapping("/partnershiprequests")
@CrossOrigin
public class PartnershipRequestController {

    private final PartnershipRequestService partnertService;

    @Autowired
    public PartnershipRequestController(PartnershipRequestService partnertService) {
        this.partnertService = partnertService;
    }

    @GetMapping
    public ResponseEntity<?> getAllPartnershipRequests() {
        return ResponseEntity.ok(partnertService.getAllPartnershipRequests());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPartnershipRequestById(@PathVariable String id) {
        try {
            return ResponseEntity.ok(partnertService.getPartnershipRequestsById(id));
        } catch (Exception e) {
            return ResponseEntity.status(404).body("PartnershipRequest not found: " + e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> createPartnershipRequest(@RequestBody CreatePartnershipRequestRequest createPartnerDTO) {
        return ResponseEntity.ok(
                partnertService.createPartnershipRequest(createPartnerDTO.getOwner(), createPartnerDTO.getPartner()));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable String id, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(partnertService.updateStatus(id, body.get("status")));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePartnershipRequest(@PathVariable String id) {
        try {
            if (partnertService.deletePartnershipRequest(id)) {
                return ResponseEntity.ok("Deletion successful");
            }
            return ResponseEntity.status(500).body("Can't delete this partnership requests.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Deletion failed: " + e.getMessage());
        }
    }

}
