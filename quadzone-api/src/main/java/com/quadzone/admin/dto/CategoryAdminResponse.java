package com.quadzone.admin.dto;

import com.quadzone.product.category.Category;
import com.quadzone.product.category.sub_category.dto.SubCategoryResponse;

import java.util.List;

public record CategoryAdminResponse(
        Long id,
        String name,
        boolean active,
        String imageUrl,
        long productCount,
        long subcategoryCount,
        List<SubCategoryResponse> subcategories
) {
    public static CategoryAdminResponse from(Category category) {
        long productCount = category.getSubcategories() != null
                ? category.getSubcategories().stream()
                .mapToLong(sub -> sub.getProducts() != null ? sub.getProducts().size() : 0)
                .sum()
                : 0;

        long subcategoryCount = category.getSubcategories() != null
                ? category.getSubcategories().size()
                : 0;

        List<SubCategoryResponse> subcategories = category.getSubcategories() != null
                ? category.getSubcategories().stream()
                .map(SubCategoryResponse::from)
                .toList()
                : List.of();

        return new CategoryAdminResponse(
                category.getId(),
                category.getName(),
                category.isActive(),
                category.getImageUrl(),
                productCount,
                subcategoryCount,
                subcategories
        );
    }
}
