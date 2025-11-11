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

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;

    @Column(unique = true)
    private String transactionId;

    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    private final PaymentStatus paymentStatus = PaymentStatus.PENDING;

    private LocalDateTime paymentDate;

    @Column(name = "created_at", updatable = false)
    private final LocalDateTime createdAt = LocalDateTime.now();

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false, unique = true)
    private Order order;


}