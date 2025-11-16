package com.quadzone.product.dto;

import com.quadzone.product.Product;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record ProductResponse(
        Long id,

        @NotBlank
        String name,
        String brand,
        String modelNumber,
        String description,

        @PositiveOrZero
        double price,

        String imageUrl,
        Integer quantity,
        boolean isActive,
        Long subCategoryId,
        String subCategoryName,
        LocalDateTime createdAt
) {
    public static ProductResponse from(Product product) {
        Long subCategoryId = null;
        String subCategoryName = null;

        if (product.getSubCategory() != null) {
            subCategoryId = product.getSubCategory().getSubcategoryId();
            subCategoryName = product.getSubCategory().getSubcategoryName();
        }
        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .brand(product.getBrand())
                .modelNumber(product.getModelNumber())
                .description(product.getDescription())
                .price(product.getPrice())
                .imageUrl(product.getImageUrl())
                .quantity(product.getQuantity())
                .isActive(product.isActive())
                .subCategoryId(subCategoryId)
                .subCategoryName(subCategoryName)
                .createdAt(product.getCreatedAt())
                .build();
    }

}
