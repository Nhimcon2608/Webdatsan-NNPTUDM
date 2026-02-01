package com.bcb.backend.mysql.mapper;

import com.bcb.backend.mysql.dto.request.BadmintonCourtRequest;
import com.bcb.backend.mysql.dto.response.BadmintonCourtImageResponse;
import com.bcb.backend.mysql.dto.response.BadmintonCourtResponse;
import com.bcb.backend.mysql.model.BadmintonCourt;
import com.bcb.backend.mysql.model.BadmintonCourtImage;
import com.bcb.backend.mysql.model.Branch;

import java.util.List;
import java.util.stream.Collectors;

public class BadmintonCourtMapper {

    public static BadmintonCourt toBadmintonCourt(BadmintonCourtRequest request, Branch branch) {
        return BadmintonCourt.builder()
                .ordinalNumber(request.getOrdinalNumber())
                .isAvailable(request.isAvailable())
                .branch(branch)
                .build();
    }

    public static BadmintonCourtResponse toResponse(BadmintonCourt court) {
        return BadmintonCourtResponse.builder()
                .id(court.getId())
                .ordinalNumber(court.getOrdinalNumber())
                .isAvailable(court.isAvailable())
                .images(toImageResponses(court.getBadmintonCourtImages()))
                .build();
    }

    private static List<BadmintonCourtImageResponse> toImageResponses(List<BadmintonCourtImage> images) {
        return images.stream()
                .map(image -> BadmintonCourtImageResponse.builder()
                        .id(image.getId())
                        .imagePath(image.getImage_path())
                        .shortDescription(image.getShortDescription())
                        .badmintonCourtId(image.getBadmintonCourt().getId())
                        .build())
                .collect(Collectors.toList());
    }
}
