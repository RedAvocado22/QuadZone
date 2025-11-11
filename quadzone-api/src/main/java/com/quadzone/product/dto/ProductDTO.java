package com.quadzone.product.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {
    private Long id;

    @NotBlank
    private String name;

    private String brand;
    private String modelNumber;

    @PositiveOrZero
    private double price;

    private String imageUrl;
    private Integer quantity;
    private boolean isActive;
    private Long subCategoryId;
    private String subCategoryName;
    private LocalDateTime createdAt;
}
