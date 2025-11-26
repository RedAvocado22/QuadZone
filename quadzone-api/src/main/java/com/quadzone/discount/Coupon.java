package com.quadzone.discount;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "coupons")
@Data
public class Coupon {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String code;

    @Enumerated(EnumType.STRING)
    private DiscountType discountType;

    private double couponValue;

    private double maxDiscountAmount;

    private double minOrderAmount;

    private Integer maxUsage;
    private Integer usageCount;

    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private boolean isActive;
}