package com.quadzone.product;

import com.quadzone.order.OrderItem;
import com.quadzone.product.category.sub_category.SubCategory;
import com.quadzone.product.dto.ProductUpdateRequest;
import com.quadzone.review.Review;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "product")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column
    private String brand;

    @Column(name = "model_number")
    private String modelNumber;

    @Column
    private String color;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private Double price;

    @Column(name = "cost_price")
    private Double costPrice;

    @Column
    private Double weight;

    @Column(name = "stock_quantity", nullable = false)
    private Integer stock;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "created_at", updatable = false)
    private final LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "is_active")
    private boolean isActive;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subcategory_id", nullable = false)
    private SubCategory subCategory;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> reviews = new ArrayList<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> orderItems = new ArrayList<>();

    public void updateFrom(ProductUpdateRequest request) {
        if (request.name() != null) {
            this.setName(request.name());
        }
        if (request.brand() != null) {
            this.setBrand(request.brand());
        }
        if (request.modelNumber() != null) {
            this.setModelNumber(request.modelNumber());
        }
        if (request.description() != null) {
            this.setDescription(request.description());
        }
        if (request.quantity() != null) {
            this.setStock(request.quantity());
        }
        if (request.price() != null) {
            this.setPrice(request.price());
        }
        if (request.costPrice() != null) {
            this.setCostPrice(request.costPrice());
        }
        if (request.weight() != null) {
            this.setWeight(request.weight());
        }
        if (request.color() != null) {
            this.setColor(request.color());
        }
        if (request.imageUrl() != null) {
            this.setImageUrl(request.imageUrl());
        }
        if (request.subCategory() != null) {
            this.setSubCategory(request.subCategory());
        }
    }

    @PreUpdate
    public void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}