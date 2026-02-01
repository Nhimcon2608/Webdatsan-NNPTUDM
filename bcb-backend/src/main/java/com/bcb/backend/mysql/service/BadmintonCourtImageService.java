package com.bcb.backend.mysql.service;

import com.bcb.backend.mysql.dto.request.BadmintonCourtImageRequest;
import com.bcb.backend.mysql.dto.response.BadmintonCourtImageResponse;
import com.bcb.backend.mysql.model.BadmintonCourt;
import com.bcb.backend.mysql.model.BadmintonCourtImage;
import com.bcb.backend.mysql.repository.BadmintonCourtImageRepository;
import com.bcb.backend.mysql.repository.BadmintonCourtRepository;
import com.bcb.backend.mysql.repository.BranchRepository;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;

@Service
public class BadmintonCourtImageService {

    private static final String COURT_NOT_FOUND = "Court not found with id: ";
    private static final String IMAGE_NOT_FOUND = "Image not found with id: ";
    private static final String IMAGE_TYPE_INVALID = "Only image files are allowed.";
    private static final String IMAGE_NOT_MATCH_COURT = "Image does not belong to the given court.";

    private final BadmintonCourtRepository courtRepo;
    private final BadmintonCourtImageRepository imageRepo;
    private final BranchRepository branchRepo;

    public BadmintonCourtImageService(BadmintonCourtRepository courtRepo,
            BadmintonCourtImageRepository imageRepo, BranchRepository branchRepo) {
        this.courtRepo = courtRepo;
        this.imageRepo = imageRepo;
        this.branchRepo = branchRepo;
    }

    public BadmintonCourtImageResponse uploadImage(BadmintonCourtImageRequest imageRequsest, MultipartFile file)
            throws IOException, IllegalAccessException {

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException(IMAGE_TYPE_INVALID);
        }

        String imageId = GenerationId.generateId("imag");

        BadmintonCourt court = courtRepo.findById(imageRequsest.getBadmintonCourtId())
                .orElseThrow(() -> new IllegalArgumentException(COURT_NOT_FOUND + imageRequsest.getBadmintonCourtId()));

        String accountId = branchRepo.findById(court.getBranch().getId())
                .orElseThrow(() -> new IllegalAccessException("Branch not found with id: " + court.getBranch().getId()))
                .getAccount().getId();

        String originalFilename = file.getOriginalFilename();
        String extension = (originalFilename != null && originalFilename.contains("."))
                ? originalFilename.substring(originalFilename.lastIndexOf("."))
                : "";

        String uploadDir = "uploads/images/" + accountId + "/";
        String fileName = imageId + extension;
        Path filePath = Paths.get(uploadDir, fileName);

        Files.createDirectories(filePath.getParent());
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        BadmintonCourtImage savedImage = imageRepo.save(BadmintonCourtImage.builder()
                .id(imageId)
                .image_path(filePath.toString())
                .shortDescription(imageRequsest.getShortDescription())
                .badmintonCourt(court)
                .build());

        return BadmintonCourtImageResponse.builder()
                .id(savedImage.getId())
                .imagePath(savedImage.getImage_path())
                .badmintonCourtId(court.getId())
                .shortDescription(savedImage.getShortDescription())
                .build();
    }

    public void deleteImage(String courtId, String imageId) {
        BadmintonCourtImage image = imageRepo.findById(imageId)
                .orElseThrow(() -> new IllegalArgumentException(IMAGE_NOT_FOUND + imageId));

        if (!image.getBadmintonCourt().getId().equals(courtId)) {
            throw new IllegalArgumentException(IMAGE_NOT_MATCH_COURT);
        }

        try {
            Files.deleteIfExists(Paths.get(image.getImage_path()));
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete image file", e);
        }

        imageRepo.deleteById(imageId);
    }
}
