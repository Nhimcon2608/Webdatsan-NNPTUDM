package com.bcb.backend.mysql.dto.response;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewResponse {

    private String id;
    private Date createAt;
    private short ratingLevel;
    private String content;
    private String branchId;

    private String accountId;
    private String username;
    private String imagePath;

}
