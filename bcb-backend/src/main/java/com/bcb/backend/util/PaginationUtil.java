package com.bcb.backend.util;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

public class PaginationUtil {
    
    private static final int DEFAULT_PAGE = 0;
    private static final int DEFAULT_SIZE = 10;
    private static final int MAX_SIZE = 100;
    private static final String DEFAULT_SORT_BY = "id";
    private static final Sort.Direction DEFAULT_DIRECTION = Sort.Direction.DESC;

    /**
     * Create a Pageable object with validation and sanitization
     * @param page page number (0-indexed)
     * @param size page size
     * @param sortBy field to sort by
     * @param sortDirection sort direction (ASC/DESC)
     * @return Pageable object
     */
    public static Pageable createPageable(int page, int size, String sortBy, String sortDirection) {
        page = page < 0 ? DEFAULT_PAGE : page;
        
        size = size <= 0 ? DEFAULT_SIZE : (size > MAX_SIZE ? MAX_SIZE : size);
        
        if (sortBy == null || sortBy.trim().isEmpty()) {
            sortBy = DEFAULT_SORT_BY;
        }
        
        Sort.Direction direction = "ASC".equalsIgnoreCase(sortDirection) 
            ? Sort.Direction.ASC 
            : DEFAULT_DIRECTION;
        
        return PageRequest.of(page, size, Sort.by(direction, sortBy));
    }

    public static <T> boolean isFirstPage(Page<T> page) {
        return page.isFirst();
    }

    public static <T> boolean isLastPage(Page<T> page) {
        return page.isLast();
    }

    public static <T> int getTotalPages(Page<T> page) {
        return page.getTotalPages();
    }

    public static <T> long getTotalElements(Page<T> page) {
        return page.getTotalElements();
    }
}
