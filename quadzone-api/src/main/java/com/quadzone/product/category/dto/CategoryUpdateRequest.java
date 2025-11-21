package com.quadzone.product.category.dto;

import org.hibernate.validator.constraints.URL;

public record CategoryUpdateRequest(
        String name,
        Boolean active,
        @URL(message = "Image URL must be a valid URL")
        String imageUrl
) {
}

