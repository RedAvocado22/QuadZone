package com.quadzone.global.dto;

import java.util.List;

public record PagedResponse<T>(
        List<T> content,
        PageInfo page
) {
    public record PageInfo(
            int size,
            int number,
            long totalElements,
            int totalPages
    ) {}

    public static <T> PagedResponse<T> of(List<T> content, long totalElements, int pageNumber, int pageSize) {
        int totalPages = (int) Math.ceil((double) totalElements / pageSize);
        return new PagedResponse<>(content, new PageInfo(pageSize, pageNumber, totalElements, totalPages));
    }
}

