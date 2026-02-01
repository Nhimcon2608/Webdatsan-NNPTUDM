package com.bcb.backend.mysql.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewRequeset {
    
    private short ratingLevel;
    private String playerId;
    private String content;
    
    private String branchId;
}
