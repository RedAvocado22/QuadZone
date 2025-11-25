package com.quadzone.product.category.dto;

import java.util.List;

import com.quadzone.product.category.Category;
import com.quadzone.product.category.sub_category.dto.SubCategoryResponse;

public record CategoryResponse(
        Long id,
        String name,
        List<SubCategoryResponse> subCategories) {
    public static CategoryResponse from(Category category) {
        return new CategoryResponse(
                category.getId(),
                category.getName(),
                category.getSubcategories().stream()
                        .map(SubCategoryResponse::from)
                        .toList());
    }
}

