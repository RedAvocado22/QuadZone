package com.quadzone.discount.dto;

import com.quadzone.discount.DiscountType;

import java.time.LocalDateTime;

public record CouponCreateRequest(
        String code,
        DiscountType discountType,
        Double couponValue,
        Double maxDiscountAmount,
        Double minOrderAmount,
        Integer maxUsage,
        LocalDateTime startDate,
        LocalDateTime endDate,
        Boolean active
) {
}


