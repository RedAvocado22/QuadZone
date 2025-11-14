package com.quadzone.product.dto;

import com.quadzone.product.Product;
import com.quadzone.product.category.sub_category.SubCategory;
import jakarta.validation.constraints.*;
import org.hibernate.validator.constraints.URL;

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
        Integer quantity,

        @NotNull(message = "Price is required")
        @Positive(message = "Price must be a positive value")
        double price,

        @NotNull(message = "Cost price is required")
        @Positive(message = "Cost price must be a positive value")
        double costPrice,

        @Positive(message = "Weight must be a positive value")
        double weight,

        String color,

        @URL(message = "Image URL must be a valid URL")
        String imageUrl,

        @NotNull(message = "SubCategory is required")
        SubCategory subCategory
) {
    public static Product toProduct(ProductRegisterRequest request) {
        return Product.builder()
                .name(request.name())
                .brand(request.brand())
                .modelNumber(request.modelNumber())
                .description(request.description())
                .quantity(request.quantity())
                .price(request.price())
                .costPrice(request.costPrice())
                .weight(request.weight())
                .color(request.color())
                .imageUrl(request.imageUrl())
                .subCategory(request.subCategory())
                .build();
    }
}
