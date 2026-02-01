package com.bcb.backend.mysql.dto.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Generic pagination response wrapper
 * @param <T> type of content
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaginationResponse<T> {
    private List<T> data;
    private int pageNumber;
    private int pageSize;
    private long totalElements;
    private int totalPages;
    private boolean isLast;
    private boolean isFirst;
}
