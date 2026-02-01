package com.bcb.backend.mysql.dto.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BadmintonCourtResponse {

    private String id;
    private short ordinalNumber;
    private boolean isAvailable;

    private List<BadmintonCourtImageResponse> images;

}
