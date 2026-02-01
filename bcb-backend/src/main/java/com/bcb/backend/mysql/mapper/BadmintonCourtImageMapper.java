package com.bcb.backend.mysql.mapper;

import com.bcb.backend.mysql.dto.response.BadmintonCourtImageResponse;
import com.bcb.backend.mysql.model.BadmintonCourtImage;

public class BadmintonCourtImageMapper {

    public static BadmintonCourtImageResponse toDTO(BadmintonCourtImage image) {
        return BadmintonCourtImageResponse.builder()
                .id(image.getId())
                .imagePath(image.getImage_path())
                .shortDescription(image.getShortDescription())
                .badmintonCourtId(
                        image.getBadmintonCourt() != null ? image.getBadmintonCourt().getId() : null)
                .build();
    }
}
