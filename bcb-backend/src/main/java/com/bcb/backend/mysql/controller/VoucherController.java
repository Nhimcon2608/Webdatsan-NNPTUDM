package com.bcb.backend.mysql.controller;

import com.bcb.backend.mysql.dto.request.VoucherRequest;
import com.bcb.backend.mysql.dto.response.VoucherResponse;
import com.bcb.backend.mysql.service.VoucherService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/vouchers")
@CrossOrigin
@RequiredArgsConstructor
public class VoucherController {

    private final VoucherService voucherService;

    @GetMapping
    public List<VoucherResponse> getAll() {
        return voucherService.getAllVouchers();
    }

    @GetMapping("/active")
    public List<VoucherResponse> getActiveVouchers() {
        return voucherService.getActiveVouchers();
    }

    @GetMapping("/{id}")
    public ResponseEntity<VoucherResponse> getById(@PathVariable String id) {
        return ResponseEntity.ok(voucherService.getVoucherById(id));
    }

    @PostMapping
    public ResponseEntity<VoucherResponse> create(@RequestBody VoucherRequest dto) {
        return ResponseEntity.ok(voucherService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<VoucherResponse> update(@PathVariable String id, @RequestBody VoucherRequest dto) {
        return ResponseEntity.ok(voucherService.updateVoucher(id, dto));
    }

    @PatchMapping("/{id}/false")
    public ResponseEntity<VoucherResponse> disable(@PathVariable String id) {
        return ResponseEntity.ok(voucherService.disableVoucher(id));
    }

    @GetMapping("/branch/{branchId}")
    public ResponseEntity<?> getAllVouchersOfBranch(@PathVariable String branchId) {
        return ResponseEntity.ok(voucherService.getAllVouchersOfBranch(branchId));
    }

    @PatchMapping("/enable")
    public ResponseEntity<VoucherResponse> enableVoucher(
            @RequestParam String voucherId,
            @RequestParam boolean status) {
        VoucherResponse response = voucherService.enableVoucher(voucherId, status);
        return ResponseEntity.ok(response);
    }

}
