package com.bcb.backend.mysql.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import com.bcb.backend.mysql.dto.request.*;
import com.bcb.backend.mysql.service.OwnerService;
import com.bcb.backend.mysql.service.RedisService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/owners")
@CrossOrigin
public class OwnersController {

    private final OwnerService ownerService;

    private final RedisService redisService;

    public OwnersController(OwnerService ownerService, RedisService redisService) throws Exception {
        this.ownerService = ownerService;
        this.redisService = redisService;
    }

    @PostMapping("/check-email-phonenumber")
    public ResponseEntity<?> checkEmailPhone(@RequestBody @Valid OwnerRequest ownerRequest,
            BindingResult bindingResult) {

        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().body(bindingResult.getAllErrors());
        }

        String email = ownerRequest.getEmail();
        String phoneNumber = ownerRequest.getPhoneNumber();

        boolean emailExistsInCache = redisService.existsEmailInCache(email);
        boolean phoneExistsInCache = redisService.existsPhoneInCache(phoneNumber);

        if (emailExistsInCache && phoneExistsInCache) {
            return ResponseEntity.ok("Both email and phone number already exist.");
        } else if (emailExistsInCache) {
            return ResponseEntity.ok("Email already exists.");
        } else if (phoneExistsInCache) {
            return ResponseEntity.ok("Phone number already exists.");
        }

        boolean emailExists = ownerService.isExistingEmail(email);
        boolean phoneExists = ownerService.isExistingPhoneNumber(phoneNumber);

        if (emailExists) {
            redisService.addEmailToCache(email);
        }

        if (phoneExists) {
            redisService.addPhoneToCache(phoneNumber);
        }

        if (emailExists && phoneExists) {
            return ResponseEntity.ok("Both email and phone number already exist.");
        } else if (emailExists) {
            return ResponseEntity.ok("Email already exists.");
        } else if (phoneExists) {
            return ResponseEntity.ok("Phone number already exists.");
        }

        return ResponseEntity.ok("Both email and phone number are available.");
    }

    @GetMapping
    public ResponseEntity<?> getAllOwner() {
        return ResponseEntity.ok(ownerService.getAllOwners());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOwnerById(@PathVariable String id) {
        return ResponseEntity.ok(ownerService.getOwnerById(id));
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<?> getOwnerByEmail(@PathVariable String email) {
        return ResponseEntity.ok(ownerService.getOwnerByEmail(email));
    }

    @GetMapping("/phone/{phoneNumber}")
    public ResponseEntity<?> getOwnerByPhoneNumber(@PathVariable String phoneNumber) {
        return ResponseEntity.ok(ownerService.getOwnerByPhone(phoneNumber));
    }

    @PostMapping
    public ResponseEntity<?> createOwner(@RequestBody OwnerRequest ownerDTO) {

        try {

            return ResponseEntity.ok(ownerService.createOwner(ownerDTO));

        } catch (Exception e) {

            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateOwner(@PathVariable String id, @RequestBody OwnerRequest ownerDTO) {

        try {

            return ResponseEntity.ok(ownerService.updateOwnerInfo(id, ownerDTO));

        } catch (Exception e) {

            return ResponseEntity.badRequest().build();

        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteOwner(@PathVariable String id) {
        try {
            if(ownerService.deleteOwner(id)) {
                return ResponseEntity.ok("Owner deleted successfully.");
            }
            return ResponseEntity.badRequest().body("Can't delete this owner.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to delete owner.");
        }
    }
}
