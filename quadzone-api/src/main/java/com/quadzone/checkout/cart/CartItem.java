package com.quadzone.checkout.cart;

import com.quadzone.product.Product;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Entity
@Table(name = "cartitem")
public class CartItem implements Serializable {
    @Column(name = "added_at", nullable = false)
    private final LocalDateTime addedAt = LocalDateTime.now();
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "cartitem_sequence")
    @SequenceGenerator(name = "cartitem_sequence", sequenceName = "cartitem_sequence", allocationSize = 100)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cart_id", nullable = false)
    private Cart cart;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;
    @Column(nullable = false)
    private final Integer quantity = 1;
}