package com.bcb.backend.mysql.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BadmintonCourtImageResponse {

    private String id;
    private String imagePath;
    private String shortDescription;
    private String badmintonCourtId;
}
