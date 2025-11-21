package com.quadzone.product.category;

import com.quadzone.product.category.dto.CategoryUpdateRequest;
import com.quadzone.product.category.sub_category.SubCategory;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"subcategories"})
@Entity
@Table(name = "category")
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String name;

    @Column(name = "is_active")
    private boolean isActive;

    @Column(name = "image_url", nullable = false)
    private String imageUrl;

    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<SubCategory> subcategories = new ArrayList<>();

    public void addSubCategory(SubCategory subCategory) {
        if (subcategories == null) {
            subcategories = new ArrayList<>();
        }
        subcategories.add(subCategory);
        subCategory.setCategory(this);
    }


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
