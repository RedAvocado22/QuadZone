// File: src/main/java/com/quadzone/product/mapper/ProductMapper.java
package com.quadzone.product.mapper;

import com.quadzone.product.Product;
import com.quadzone.product.category.sub_category.SubCategory;
import com.quadzone.product.dto.ProductDTO;

import java.time.LocalDateTime;

public class ProductMapper {

    public static ProductDTO toDTO(Product p) {
        if (p == null)
            return null;
        ProductDTO dto = new ProductDTO();
        dto.setId(p.getId());
        dto.setName(p.getName());
        dto.setBrand(p.getBrand());
        dto.setModelNumber(p.getModelNumber());
        dto.setPrice(p.getPrice());
        dto.setImageUrl(p.getImageUrl());
        dto.setQuantity(p.getQuantity());
        dto.setActive(p.isActive());
        dto.setCreatedAt(p.getCreatedAt() == null ? LocalDateTime.now() : p.getCreatedAt());
        if (p.getSubCategory() != null) {
            SubCategory sc = p.getSubCategory();
            dto.setSubCategoryId((long) sc.getSubcategoryId());
            dto.setSubCategoryName(sc.getSubcategoryName());
        }
        return dto;
    }

    public static Product toEntity(ProductDTO dto) {
        if (dto == null)
            return null;
        Product p = new Product();
        p.setId(dto.getId());
        p.setName(dto.getName());
        p.setBrand(dto.getBrand());
        p.setModelNumber(dto.getModelNumber());
        p.setPrice(dto.getPrice());
        p.setImageUrl(dto.getImageUrl());
        p.setQuantity(dto.getQuantity());
        p.setActive(dto.isActive());
        // createdAt and subCategory should be handled by service
        return p;
    }
}
