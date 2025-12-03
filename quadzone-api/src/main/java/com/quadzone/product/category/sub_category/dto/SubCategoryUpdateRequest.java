package com.quadzone.product.category.sub_category.dto;

public record SubCategoryUpdateRequest(
        String name,
        Long categoryId,
        Boolean active
) {
}
