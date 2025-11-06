    package com.quadzone.product.category.sub_category;

    import com.quadzone.product.Product;
    import com.quadzone.product.category.Category;
    import jakarta.persistence.*;
    import lombok.AllArgsConstructor;
    import lombok.Builder;
    import lombok.NoArgsConstructor;

    import java.time.LocalDateTime;
    import java.util.List;

    @Entity
    @Table(name = "sub_category")
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public class SubCategory {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @Column (name = "subcategory_name", nullable = false, length = 100)
        private String name;

        @Column(columnDefinition = "TEXT")
        private String description;

        @Column(name = "is_active")
        private boolean isActive;

        @Column(name = "created_at", nullable = false)
        private final LocalDateTime createdAt = LocalDateTime.now();

        @ManyToOne
        @JoinColumn(name = "category_category_id")
        private Category category;

        @OneToMany(mappedBy = "subCategory", cascade = CascadeType.ALL, orphanRemoval = true)
        private List<Product> products;


    }
