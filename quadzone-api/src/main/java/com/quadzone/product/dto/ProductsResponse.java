package com.quadzone.product.dto;

import com.quadzone.product.Product;
import com.quadzone.product.category.Category;
import com.quadzone.product.category.sub_category.SubCategory;
import lombok.Builder;

import java.util.List;

@Builder
public record ProductsResponse(
        Long id,
        String name,
        String brand,
        String modelNumber,
        String description,
        double price,
        String imageUrl,
        Integer quantity,
        SubCategory subCategory,
        Category category,
        List<ReviewsResponse> reviews
) {
    public static ProductsResponse from(Product product) {
        return new ProductsResponse(
                product.getId(),
                product.getName(),
                product.getBrand(),
                product.getModelNumber(),
                product.getDescription(),
                product.getPrice(),
                product.getImageUrl(),
                product.getStock(),
                product.getSubCategory(),
                product.getSubCategory().getCategory(),
                null
        );
    }
}
