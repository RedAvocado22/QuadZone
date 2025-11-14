package com.quadzone.admin.dto;

public record AdminProductResponse(
        Long id,
        String name,
        String brand,
        double price,
        Integer quantity,
        boolean active,
        String imageUrl
) {
}

