package com.quadzone.admin.dto;

public record AdminCategoryResponse(
        Long id,
        String name,
        boolean active,
        long productCount,
        String imageUrl
) {
}

