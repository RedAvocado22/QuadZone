package com.quadzone.product.review;

import com.quadzone.checkout.order.Order;
import com.quadzone.product.Product;
import com.quadzone.user.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
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
    private String reviewTitle;

    @Column(columnDefinition = "TEXT")
    private String reviewText;

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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order; // optional verified purchase link

    @PreUpdate
    public void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

}