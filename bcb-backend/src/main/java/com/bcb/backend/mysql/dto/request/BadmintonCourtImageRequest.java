package com.bcb.backend.mysql.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BadmintonCourtImageRequest {
    // private String imagePath;
    private String shortDescription;
    private String badmintonCourtId;
}
