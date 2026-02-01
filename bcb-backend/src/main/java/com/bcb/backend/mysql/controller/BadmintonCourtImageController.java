package com.bcb.backend.mysql.controller;

import com.bcb.backend.mysql.dto.request.BadmintonCourtImageRequest;
import com.bcb.backend.mysql.service.BadmintonCourtImageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/badminton-courts-images")
public class BadmintonCourtImageController {

    private final BadmintonCourtImageService badmintonCourtImageService;

    public BadmintonCourtImageController(BadmintonCourtImageService badmintonCourtImageService) {
        this.badmintonCourtImageService = badmintonCourtImageService;
    }

    @PostMapping
    public ResponseEntity<String> uploadImage(BadmintonCourtImageRequest request,
            @RequestParam("file") MultipartFile file) {

        try {
            badmintonCourtImageService.uploadImage(request, file);
            return ResponseEntity.ok("Upload successful");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Upload failed: " + e.getMessage());
        }
    }

    @DeleteMapping("/{courtId}/images/{imageId}")
    public ResponseEntity<String> deleteImage(@PathVariable String courtId, @PathVariable String imageId) {
        try {
            badmintonCourtImageService.deleteImage(courtId, imageId);
            return ResponseEntity.ok("Image deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Deletion failed: " + e.getMessage());
        }
    }
}
