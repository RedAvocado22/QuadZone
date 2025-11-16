package com.quadzone.product.category;

import com.quadzone.product.category.sub_category.SubCategory;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import com.quadzone.product.category.dto.CategoryUpdateRequest;

@Entity
@Table(name = "category")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_id")
    private Long id;

    @Column
    private String name;

    @Column(name = "is_active")
    private boolean isActive;

    @Column(name = "image_url", nullable = false)
    private String imageUrl;

    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SubCategory> subcategories;

    public void updateFrom(CategoryUpdateRequest request) {
        if (request.name() != null) {
            this.setName(request.name());
        }
        if (request.active() != null) {
            this.setActive(request.active());
        }
        if (request.imageUrl() != null) {
            this.setImageUrl(request.imageUrl());
        }
    }
}
