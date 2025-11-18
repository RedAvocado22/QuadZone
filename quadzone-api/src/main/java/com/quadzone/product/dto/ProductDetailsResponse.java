package com.quadzone.product.dto;

import com.quadzone.product.Product;
import com.quadzone.product.category.dto.CategoryResponse;
import com.quadzone.product.category.sub_category.dto.SubCategoryResponse;
import com.quadzone.product.review.dto.ReviewResponse;

import java.util.List;

public record ProductDetailsResponse(
        Long id,
        String name,
        String brand,
        String modelNumber,
        String description,
        double price,
        String imageUrl,
        Integer quantity,
        SubCategoryResponse subCategory,
        CategoryResponse category,
        List<ReviewResponse> reviews
) {
    public static ProductDetailsResponse from(Product product) {
        return new ProductDetailsResponse(
                product.getId(),
                product.getName(),
                product.getBrand(),
                product.getModelNumber(),
                product.getDescription(),
                product.getPrice(),
                product.getImageUrl(),
                product.getStock(),
                SubCategoryResponse.from(product.getSubCategory()),
                CategoryResponse.from(product.getSubCategory().getCategory()),
                //convert list review to list review response
                product.getReviews().stream().map(ReviewResponse::from).toList()
        );
    }
}