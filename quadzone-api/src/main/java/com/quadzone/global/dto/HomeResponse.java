package com.quadzone.global.dto;

import com.quadzone.product.category.dto.CategoryResponse;
import com.quadzone.product.dto.ProductResponse;
import org.springframework.data.domain.Page;

import java.util.List;

public record HomeResponse(
        List<CategoryResponse> categories,
        Page<ProductResponse> featured,
        Page<ProductResponse> bestSellers,
        Page<ProductResponse> newArrivals
) {
}
