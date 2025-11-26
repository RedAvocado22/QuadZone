package com.quadzone.product.dto;

import com.quadzone.product.Product;
import com.quadzone.product.category.sub_category.SubCategory;
import jakarta.validation.constraints.*;

public record ProductRegisterRequest(

        @NotBlank(message = "Product name cannot be blank")
        @Size(min = 3, max = 255, message = "Product name must be between 3 and 255 characters")
        String name,

        @NotBlank(message = "Brand name cannot be blank")
        @Size(max = 100, message = "Brand name cannot exceed 100 characters")
        String brand,

        String modelNumber,

        @Size(max = 1000, message = "Description cannot exceed 1000 characters")
        String description,

        @NotNull(message = "Quantity is required")
        @Min(value = 0, message = "Quantity cannot be negative")
        Integer stock,

        @NotNull(message = "Price is required")
        @Positive(message = "Price must be a positive value")
        double price,

        @NotNull(message = "Cost price is required")
        @Positive(message = "Cost price must be a positive value")
        double costPrice,

        @Positive(message = "Weight must be a positive value")
        double weight,

        String color,

        String imageUrl,  // Allow null or empty, validation can be done in service

        SubCategory subCategory  // Allow null for now, can be set later
) {
    public static Product toProduct(ProductRegisterRequest request) {
        String imageUrl = request.imageUrl() != null && !request.imageUrl().trim().isEmpty()
                ? request.imageUrl().trim()
                : null;

        return Product.builder()
                .name(request.name())
                .brand(request.brand())
                .modelNumber(request.modelNumber())
                .description(request.description())
                .stock(request.stock())
                .price(request.price())
                .costPrice(request.costPrice())
                .weight(request.weight())
                .color(request.color())
                .imageUrl(imageUrl)
                .subCategory(request.subCategory())  // Can be null, should be set via update
                .build();
    }
}
