package com.bcb.backend.mysql.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Pagination request parameters
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaginationRequest {
    private int page = 0;
    private int size = 10;
    private String sortBy = "createAt";
    private String sortDirection = "DESC";

    public int getPage() {
        return page < 0 ? 0 : page;
    }

    public int getSize() {
        return size <= 0 ? 10 : (size > 100 ? 100 : size);
    }
}
