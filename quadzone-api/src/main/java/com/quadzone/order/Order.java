package com.quadzone.order;

import com.quadzone.order.dto.OrderUpdateRequest;
import com.quadzone.payment.Payment;
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
@ToString(exclude = {"orderItems", "user", "payment"})
@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, updatable = false)
    private LocalDateTime orderDate = LocalDateTime.now();

    @Column
    private Double subtotal;

    @Column
    private Double taxAmount;

    @Column
    private Double shippingCost;

    @Column
    private Double discountAmount;

    @Column
    private Double totalAmount;

    @Enumerated(EnumType.STRING)
    @Column(name = "order_status")
    private OrderStatus orderStatus = OrderStatus.PENDING;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(columnDefinition = "TEXT")
    private String address;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> orderItems = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToOne(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Payment payment;

    public void addOrderItem(OrderItem item) {
        if (orderItems == null) {
            orderItems = new ArrayList<>();
        }
        orderItems.add(item);
        item.setOrder(this);
    }

    public void updateFrom(OrderUpdateRequest request) {
        if (request.subtotal() != null) {
            this.setSubtotal(request.subtotal());
        }
        if (request.taxAmount() != null) {
            this.setTaxAmount(request.taxAmount());
        }
        if (request.shippingCost() != null) {
            this.setShippingCost(request.shippingCost());
        }
        if (request.discountAmount() != null) {
            this.setDiscountAmount(request.discountAmount());
        }
        if (request.totalAmount() != null) {
            this.setTotalAmount(request.totalAmount());
        }
        if (request.orderStatus() != null) {
            this.setOrderStatus(request.orderStatus());
        }
        if (request.notes() != null) {
            this.setNotes(request.notes());
        }
        if (request.address() != null) {
            this.setAddress(request.address());
        }
    }
}