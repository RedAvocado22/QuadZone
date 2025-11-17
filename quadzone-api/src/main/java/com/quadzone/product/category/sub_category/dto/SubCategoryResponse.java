package com.quadzone.product.category.sub_category.dto;

import com.quadzone.product.category.sub_category.SubCategory;

public record SubCategoryResponse(
        Integer id,
        String name
) {
    public static SubCategoryResponse from(final SubCategory subCategory) {
        return new SubCategoryResponse(
                subCategory.getId(),
                subCategory.getName()
        );
    }
}