package com.quadzone.product.category.dto;

import com.quadzone.product.category.Category;

public record CategoryResponse(
        Long id,
        String name,
        boolean active,
        long productCount,
        String imageUrl
) {
    public static CategoryResponse from(Category category) {
        long productCount = category.getSubcategories() != null ? category.getSubcategories().size() : 0;
        return new CategoryResponse(
                category.getId(),
                category.getName(),
                category.isActive(),
                productCount,
                category.getImageUrl()
        );
    }
}

