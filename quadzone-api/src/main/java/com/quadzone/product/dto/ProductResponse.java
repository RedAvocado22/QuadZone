package com.quadzone.product.dto;

import com.quadzone.product.Product;
import com.quadzone.product.category.dto.CategoryResponse;
import com.quadzone.product.category.sub_category.dto.SubCategoryResponse;

public record ProductResponse(
        Long id,
        String name,
        String brand,
        double price,
        String imageUrl,
        Integer quantity,
        SubCategoryResponse subCategory,
        CategoryResponse category
) {
    public static ProductResponse from(Product product) {
        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getBrand(),
                product.getPrice(),
                product.getImageUrl(),
                product.getStock(),
                SubCategoryResponse.from(product.getSubCategory()),
                CategoryResponse.from(product.getSubCategory().getCategory())
        );
    }
}
