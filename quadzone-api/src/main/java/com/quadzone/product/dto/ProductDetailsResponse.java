package com.quadzone.product.dto;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.quadzone.product.Product;
import com.quadzone.product.category.dto.CategoryResponse;
import com.quadzone.product.category.sub_category.dto.SubCategoryResponse;
import com.quadzone.review.dto.ReviewResponse;

import java.util.ArrayList;
import java.util.List;

public record ProductDetailsResponse(
        Long id,
        String name,
        String brand,
        String modelNumber,
        List<String> description,
        double weight,
        double price,
        String imageUrl,
        Integer quantity,
        SubCategoryResponse subCategory,
        CategoryResponse category,
        List<ReviewResponse> reviews) {
    public static ProductDetailsResponse from(Product product) {
        ObjectMapper mapper = new ObjectMapper();

        List<String> descriptions = new ArrayList<>();

        try {
            if (product.getDescription() != null) {
                descriptions = mapper.readValue(
                        product.getDescription(),
                        new TypeReference<List<String>>() {
                        });
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return new ProductDetailsResponse(
                product.getId(),
                product.getName(),
                product.getBrand(),
                product.getModelNumber(),
                descriptions,
                product.getWeight(),
                product.getPrice(),
                product.getImageUrl(),
                product.getStock(),
                SubCategoryResponse.from(product.getSubCategory()),
                CategoryResponse.from(product.getSubCategory().getCategory()),
                // convert list review to list review response
                product.getReviews().stream().map(ReviewResponse::from).toList());
    }
}