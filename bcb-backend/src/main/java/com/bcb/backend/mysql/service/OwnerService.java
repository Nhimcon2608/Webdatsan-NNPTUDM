package com.bcb.backend.mysql.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.bcb.backend.mysql.dto.request.*;
import com.bcb.backend.mysql.dto.response.*;
import com.bcb.backend.mysql.mapper.OwnerMapper;
import com.bcb.backend.mysql.model.Owner;
import com.bcb.backend.mysql.repository.OwnerRepository;

@Service
public class OwnerService {

    private final OwnerRepository ownerRepo;

    public OwnerService(OwnerRepository ownerRepo) {
        this.ownerRepo = ownerRepo;
    }

    public boolean isExistingPhoneNumber(String phoneNumber) {
        if (phoneNumber == null || phoneNumber.isBlank()) {
            throw new IllegalArgumentException("Phone number must not be null or blank");
        }
        return ownerRepo.existsByPhoneNumber(phoneNumber);
    }

    public boolean isExistingEmail(String emaill) {
        if (emaill == null || emaill.isBlank()) {
            throw new IllegalArgumentException("Email must not be null or blank");
        }
        return ownerRepo.existsByEmail(emaill);
    }

    public List<OwnerResponse> getAllOwners() {
        return ownerRepo.findAll().stream().map(OwnerMapper::toDTO).collect(Collectors.toList());
    }

    public OwnerResponse getOwnerById(String id) {
        return ownerRepo.findById(id)
                .map(OwnerMapper::toDTO)
                .orElseThrow(() -> new IllegalArgumentException("Owner not found with id: " + id));
    }

    public OwnerResponse getOwnerByEmail(String email) {
        return ownerRepo.findByEmail(email)
                .map(OwnerMapper::toDTO)
                .orElseThrow(() -> new IllegalArgumentException("Owner not found with email: " + email));
    }

    public OwnerResponse getOwnerByPhone(String phoneNumber) {
        return ownerRepo.findByPhoneNumber(phoneNumber)
                .map(OwnerMapper::toDTO)
                .orElseThrow(() -> new IllegalArgumentException("Owner not found with phone: " + phoneNumber));
    }

    public OwnerResponse createOwner(OwnerRequest ownerRequest) {
        if (ownerRequest.getOwnerName() == null || ownerRequest.getEmail() == null
                || ownerRequest.getPhoneNumber() == null) {
            throw new IllegalArgumentException("Owner name, email, and phone number must not be null");
        }

        String generatedId = GenerationId.generateId("owne");
        ownerRequest.setId(generatedId);

        try {
            return OwnerMapper.toDTO(ownerRepo.save(OwnerMapper.toEntity(ownerRequest)));
        } catch (Exception e) {
            throw e;
        }
    }

    public OwnerResponse updateOwnerInfo(String id, OwnerRequest ownerRequest) {
        return ownerRepo.findById(id)
                .map(existingOwner -> {
                    if (ownerRequest.getOwnerName() != null) {
                        existingOwner.setOwnerName(ownerRequest.getOwnerName());
                    }
                    if (ownerRequest.getEmail() != null) {
                        existingOwner.setEmail(ownerRequest.getEmail());
                    }
                    if (ownerRequest.getPhoneNumber() != null) {
                        existingOwner.setPhoneNumber(ownerRequest.getPhoneNumber());
                    }
                    try {
                        ownerRepo.save(existingOwner);
                        return OwnerMapper.toDTO(existingOwner);
                    } catch (Exception e) {
                        throw e;
                    }

                })
                .orElseThrow(() -> new IllegalArgumentException("Owner not found with id: " + id));
    }

    public boolean deleteOwner(String id) {

        Owner owner = ownerRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Owner not found with id: " + id));

        if (owner.getPartnershipRequests().size() == 0) {
            ownerRepo.delete(owner);
            return true;
        }

        return false;
    }

}
