package com.bcb.backend.mysql.controller;

import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.bcb.backend.mysql.dto.request.CreateBranchRequest;
import com.bcb.backend.mysql.dto.request.UpdateBranchRequest;
import com.bcb.backend.mysql.dto.response.BranchResponse;
import com.bcb.backend.mysql.service.BranchService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/branches")
@CrossOrigin
@RequiredArgsConstructor
public class BranchController {

	private final BranchService branchService;

	@GetMapping("/is-cooperated/{cooperated}")
	public ResponseEntity<?> getAllBranchs(@PathVariable String cooperated) {
		if (cooperated.equals("all")) {
			return ResponseEntity.ok(branchService.getAllBranchs());
		} else {
			return ResponseEntity.ok(branchService.getBranchsByCooperated(Boolean.parseBoolean(cooperated)));
		}
	}

	@GetMapping("request/{requestId}")
	public ResponseEntity<?> getBranchByPartnershipRequest(@PathVariable String requestId) {
		return ResponseEntity.ok(branchService.getBranchByPartnershipRequest(requestId));
	}

	@GetMapping("/{id}")
	public ResponseEntity<?> getBranchById(@PathVariable String id) {
		return ResponseEntity.ok(branchService.getBranchById(id));
	}

	@PutMapping("/{id}/status")
	public ResponseEntity<?> changeCooperate(@PathVariable String id, @RequestBody Map<String, Boolean> request) {
		return ResponseEntity.ok(branchService.changeCooperate(id, request.get("cooperated")));
	}

	@PostMapping
	public ResponseEntity<?> createBranch(@Valid @RequestBody CreateBranchRequest branchRequest) throws Exception {
		return ResponseEntity.ok(branchService.createBranch(branchRequest));
	}

	@PutMapping("/{id}/update")
	public ResponseEntity<?> updateBranch(@PathVariable String id, @Valid @RequestBody UpdateBranchRequest request) {
		return ResponseEntity.ok(branchService.updateInformation(id, request));
	}

	@GetMapping("/manager/{accountId}")
	public BranchResponse getBranchByAccountId(@PathVariable String accountId) {
		return branchService.getBranchByAccountId(accountId);
	}
}