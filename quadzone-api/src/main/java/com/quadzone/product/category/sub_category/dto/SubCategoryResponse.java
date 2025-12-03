package com.quadzone.product.category.sub_category.dto;

import com.quadzone.product.category.sub_category.SubCategory;

public record SubCategoryResponse(
        Long id,
        String name
) {
    public static SubCategoryResponse from(final SubCategory subCategory) {
        if (subCategory == null) {
            return null;
        }
        return new SubCategoryResponse(
                subCategory.getId(),
                subCategory.getName()
        );
    }
}