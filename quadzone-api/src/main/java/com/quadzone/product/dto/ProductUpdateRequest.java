package com.quadzone.product.dto;

import com.quadzone.product.category.sub_category.SubCategory;

public record ProductUpdateRequest(
        String name,
        String brand,
        String modelNumber,
        String description,
        Integer quantity,
        Double price,     // Must be Double, not double, toProduct allow null
        Double costPrice, // Must be Double
        Double weight,    // Must be Double
        String color,
        String imageUrl,
        SubCategory subCategory
) {
}