package com.quadzone.product;

import com.quadzone.product.category.sub_category.SubCategory;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "product")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    @Column(name = "created_at", nullable = false)
    private final LocalDateTime createdAt = LocalDateTime.now();
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id")
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subcategory_id", nullable = false)
    private SubCategory subCategory;
    @Column(name = "product_name", nullable = false, length = 200)
    private String name;
    @Column(length = 100)
    private String brand;
    @Column(name = "model_number", length = 100)
    private String modelNumber;
    @Column(columnDefinition = "TEXT")
    private String description;
    @Column(nullable = false, length = 50, unique = true)
    private String sku; // Unique product code
    @Column(name = "quantity", nullable = false, columnDefinition = "INT DEFAULT 0")
    private Integer quantity;
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;
    @Column(name = "cost_price", precision = 10, scale = 2)
    private BigDecimal costPrice;
    @Column(name = "weight_kg", precision = 8, scale = 3)
    private BigDecimal weightKg;
    @Column(length = 50)
    private String dimensions;
    @Column(columnDefinition = "TEXT")
    private String specifications;
    @Column(name = "warranty_period_months")
    private Integer warrantyPeriodMonths;
    @Column(length = 50)
    private String color;
    @Column(name = "storage_capacity", length = 50)
    private String storageCapacity;
    @Column(name = "energy_rating", length = 20)
    private String energyRating;
    @Column(name = "image_url", length = 255)
    private String imageUrl;
    @Column(name = "is_active")
    private boolean isActive;
}
