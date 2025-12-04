package com.quadzone.product.category.dto;

import com.quadzone.product.category.Category;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CategoryRegisterRequest(
        @NotBlank(message = "Category name cannot be blank")
        @Size(min = 1, max = 255, message = "Category name must be between 1 and 255 characters")
        String name,

        Boolean active,

        String imageUrl  // Allow null or empty, defaults to empty string
) {
    public static Category toCategory(CategoryRegisterRequest request) {
        return Category.builder()
                .name(request.name())
                .isActive(request.active() != null ? request.active() : true)
                .imageUrl(request.imageUrl() != null && !request.imageUrl().isEmpty() ? request.imageUrl() : "")
                .build();
    }
}

