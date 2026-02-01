package com.bcb.backend.mysql.controller;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.bcb.backend.mysql.dto.request.AccountRequest;
import com.bcb.backend.mysql.dto.request.ChangePasswordRequest;
import com.bcb.backend.mysql.dto.request.ChangeRoleRequets;
import com.bcb.backend.mysql.service.AccountService;
import com.bcb.backend.util.JwtUtil;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/accounts")
public class AccountController {

	private final AccountService accountService;
	private final JwtUtil jwtUtil;

	public AccountController(AccountService accountService, JwtUtil jwtUtil) {
		this.accountService = accountService;
		this.jwtUtil = jwtUtil;
	}

	@PreAuthorize("isAuthenticated()")
	@GetMapping("/me")
	public ResponseEntity<?> getAccountByUsername(HttpServletRequest httpRequest) {

		Map<String, String> tokenExtracted = extractToken(httpRequest);

		if (tokenExtracted != null) {
			String username = tokenExtracted.get("username");

			return ResponseEntity.ok(accountService.getAccountByUserName(username));
		}
		return ResponseEntity.badRequest().body("Invalid authorization.");
	}

	@PreAuthorize("isAuthenticated()")
	@PutMapping("/upload-image")
	public ResponseEntity<?> uploadImage(HttpServletRequest httpRequest, @RequestParam("file") MultipartFile file)
			throws IOException {

		Map<String, String> tokenExtracted = extractToken(httpRequest);

		if (tokenExtracted != null) {
			return ResponseEntity.ok(accountService.uploadImage(tokenExtracted.get("id"), file));
		}
		return ResponseEntity.badRequest().body("Invalid authorization.");
	}

	@PreAuthorize("isAuthenticated()")
	@PatchMapping("/change-password")
	public ResponseEntity<?> changePassword(HttpServletRequest httpRequest,
			@RequestBody ChangePasswordRequest changePasswordRequest) {

		Map<String, String> tokenExtracted = extractToken(httpRequest);

		if (tokenExtracted != null) {

			String id = tokenExtracted.get("id");

			try {
				accountService.changePassword(id, changePasswordRequest);
			} catch (Exception e) {
				throw e;
			}

			return ResponseEntity.ok("Password changed successfully.");
		}

		return ResponseEntity.badRequest().body("Invalid authorization.");
	}

	// @PreAuthorize("hasRole('ADMIN')")
	@PostMapping("/manager/register")
	public ResponseEntity<?> createManagerAccount(@RequestBody AccountRequest request) {
		return ResponseEntity.ok(accountService.registerManagerAccount(request));
	}

	// only admin
	@PreAuthorize("hasRole('ADMIN')")
	@PatchMapping("/change-role")
	public ResponseEntity<?> changeRole(@RequestBody ChangeRoleRequets requets) {
		return ResponseEntity.ok(accountService.changeRole(requets.getId(), requets.getRole()));
	}

	private Map<String, String> extractToken(HttpServletRequest httpRequest) {

		String authHeader = httpRequest.getHeader("Authorization");

		if (authHeader != null && authHeader.startsWith("Bearer ")) {
			String token = authHeader.substring(7);

			String id = jwtUtil.extractAccountId(token);
			String username = jwtUtil.extractUsername(token);

			Map<String, String> tokenExtracted = new HashMap<>();

			tokenExtracted.put("id", id);
			tokenExtracted.put("username", username);

			return tokenExtracted;

		}

		return null;
	}

}
