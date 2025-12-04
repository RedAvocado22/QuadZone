package com.quadzone.product.category.sub_category.dto;


import com.quadzone.admin.dto.CategoryAdminResponse;

import com.quadzone.product.category.sub_category.SubCategory;

public record SubCategoryAdminResponse(
        Long id,
        String name,
        Boolean active,
        String description,
        long productCount,
        CategoryAdminResponse categoryResponse
) {
    public static SubCategoryAdminResponse from(SubCategory sub) {
        long productCount = sub.getProducts() != null ? sub.getProducts().size() : 0;
        CategoryAdminResponse categoryResponse = null;
        if (sub.getCategory() != null && sub.getCategory() != null) {
            categoryResponse = CategoryAdminResponse.from(sub.getCategory());
        }

        return new SubCategoryAdminResponse(
                sub.getId(),
                sub.getName(),
                sub.getIsActive(),
                sub.getDescription(),
                productCount,
                categoryResponse
        );
    }
}