package com.quadzone.product.dto;

import com.quadzone.product.category.sub_category.SubCategory;

public record ProductUpdateRequest(
        String name,
        String brand,
        String modelNumber,
        String description,
        Integer quantity,
        Double price,
        Double costPrice,
        Double weight,
        String color,
        String imageUrl,
        SubCategory subCategory,
        Boolean isActive
) {
}