package com.quadzone.review;

import com.quadzone.order.OrderItem;
import com.quadzone.product.Product;
import com.quadzone.user.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@ToString(exclude = {"product", "user", "orderItem"})
@Entity
@Table(name = "review")
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(nullable = false)
    private Integer rating; // 1 to 5

    @Column(name = "review_title", length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "created_at", updatable = false)
    private final LocalDateTime createdAt = LocalDateTime.now();
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private User user;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_item_id", unique = true)
    private OrderItem orderItem;

    @Enumerated(EnumType.STRING)
    private ReviewStatus status = ReviewStatus.VISIBLE;

    @PreUpdate
    public void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}