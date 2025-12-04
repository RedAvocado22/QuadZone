package com.quadzone.discount;

import com.quadzone.order.Order;
import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "coupons")
@Data
@ToString(exclude = "orders")
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

    // Orders that used this coupon
    @OneToMany(mappedBy = "coupon")
    private List<Order> orders = new ArrayList<>();
}