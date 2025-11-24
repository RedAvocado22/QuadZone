package com.quadzone.admin.dto;

import com.quadzone.product.Product;
import com.quadzone.product.category.dto.CategoryResponse;
import com.quadzone.product.category.sub_category.dto.SubCategoryResponse;

import java.time.LocalDateTime;

public record ProductAdminResponse(
        Long id,
        String name,
        String brand,
        String modelNumber,
        String color,
        String description,
        double price,
        Double costPrice,
        Double weight,
        Integer quantity,
        String imageUrl,
        boolean isActive,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,  // May be null if product hasn't been updated yet
        SubCategoryResponse subCategory,
        CategoryResponse category
) {
    public static ProductAdminResponse from(Product product) {
        return new ProductAdminResponse(
                product.getId(),
                product.getName(),
                product.getBrand(),
                product.getModelNumber(),
                product.getColor(),
                product.getDescription(),
                product.getPrice(),
                product.getCostPrice(),
                product.getWeight(),
                product.getStock(),
                product.getImageUrl(),
                product.isActive(),
                product.getCreatedAt(),
                product.getUpdatedAt(),
                SubCategoryResponse.from(product.getSubCategory()),
                CategoryResponse.from(product.getSubCategory().getCategory())
        );
    }
}
