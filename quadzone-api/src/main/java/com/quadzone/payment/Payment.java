package com.quadzone.payment;

import com.quadzone.checkout.order.Order;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "payment")
public class Payment {
    @Column(name = "created_at", updatable = false)
    private final LocalDateTime createdAt = LocalDateTime.now();
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", nullable = false)
    private Long id;
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false, unique = true)
    private Order order;
    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;
    @Column(unique = true)
    private String transactionId;
    private BigDecimal amount;
    @Enumerated(EnumType.STRING)
    private final PaymentStatus paymentStatus = PaymentStatus.PENDING;
    private LocalDateTime paymentDate;
}