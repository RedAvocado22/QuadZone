package com.quadzone.product.category.dto;

import com.quadzone.product.category.Category;

public record CategoryResponse(
        Long id,
        String name
) {
    public static CategoryResponse from(final Category category) {
        return new CategoryResponse(category.getId(), category.getName());
    }
}
