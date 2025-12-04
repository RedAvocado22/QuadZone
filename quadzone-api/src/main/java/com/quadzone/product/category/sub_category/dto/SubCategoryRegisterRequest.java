package com.quadzone.product.category.sub_category.dto;

public record SubCategoryRegisterRequest(
        String name,
        Long categoryId,
        Boolean active
) {
}