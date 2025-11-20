package com.quadzone.product.category.dto;

import com.quadzone.product.category.Category;

public record CategoryNameResponse(Long id, String name) {
    public static CategoryNameResponse from(Category category) {
        return new CategoryNameResponse(
                category.getId(),
                category.getName());
    }
}
