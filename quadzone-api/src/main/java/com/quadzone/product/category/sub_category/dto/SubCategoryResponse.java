package com.quadzone.product.category.sub_category.dto;

import com.quadzone.product.category.sub_category.SubCategory;

public record SubCategoryResponse(
        Long id,
        String name,
        Boolean active,
        long productCount,
        Long categoryId,
        String categoryName
) {
    public static SubCategoryResponse from(SubCategory sub) {
        long productCount = sub.getProducts() != null ? sub.getProducts().size() : 0;

        return new SubCategoryResponse(
                sub.getId(),
                sub.getName(),
                sub.getIsActive(),
                productCount,
                sub.getCategory() != null ? sub.getCategory().getId() : null,
                sub.getCategory() != null ? sub.getCategory().getName() : null
        );
    }
}