package com.quadzone.shipping;

import com.quadzone.order.Order;
import com.quadzone.user.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "deliveries")
public class Delivery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "tracking_number", unique = true)
    private String trackingNumber;

    private String carrier; // e.g., FedEx
    @Enumerated(EnumType.STRING)
    @Column(name = "delivery_status", length = 30)
    private DeliveryStatus deliveryStatus = DeliveryStatus.PENDING;

    @Column(name = "estimated_delivery_date")
    private LocalDateTime estimatedDeliveryDate;

    @Column(name = "actual_delivery_date")
    private LocalDateTime actualDeliveryDate;

    @Column(columnDefinition = "TEXT")
    private String deliveryNotes;

    @Column(name = "signature_required")
    private final Boolean signatureRequired = true;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "created_at", updatable = false)
    private final LocalDateTime createdAt = LocalDateTime.now();

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false, unique = true)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shipper_id")
    private User user;

    @PreUpdate
    public void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
