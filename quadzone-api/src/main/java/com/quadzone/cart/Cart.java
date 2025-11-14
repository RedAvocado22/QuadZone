package com.quadzone.cart;

import com.quadzone.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString(exclude = {"items", "user"})
@Entity
@Table(name = "cart")
public class Cart {
    @Column(name = "created_at", nullable = false)
    private final LocalDateTime createdAt = LocalDateTime.now();
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long id;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CartItem> items;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false, unique = true)
    private User user;

    @PreUpdate
    public void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public void addCartItem(CartItem item) {
        if (items == null) {
            items = new ArrayList<>();
        }
        items.add(item);
        item.setCart(this);
    }
}