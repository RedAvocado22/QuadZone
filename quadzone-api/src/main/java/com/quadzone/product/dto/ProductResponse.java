package com.quadzone.product.dto;

import com.quadzone.product.Product;
import com.quadzone.product.category.dto.CategoryNameResponse;

import com.quadzone.product.category.sub_category.dto.SubCategoryResponse;

public record ProductResponse(
        Long id,
        String name,
        String brand,
        double price,
        String imageUrl,
        Integer quantity,
        SubCategoryResponse subCategory,
        CategoryNameResponse category) {
    public static ProductResponse from(Product product) {
        SubCategoryResponse subCategoryResponse = SubCategoryResponse.from(product.getSubCategory());
        CategoryNameResponse categoryResponse = null;
        
        // Safe null-check for category
        if (product.getSubCategory() != null && product.getSubCategory().getCategory() != null) {
            categoryResponse = CategoryNameResponse.from(product.getSubCategory().getCategory());
        }
        
        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getBrand(),
                product.getPrice(),
                product.getImageUrl(),
                product.getStock(),
                subCategoryResponse,
                categoryResponse);
    }
}