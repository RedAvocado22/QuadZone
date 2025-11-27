package com.quadzone.discount.dto;

public record CouponValidationResponse(
        boolean valid,
        String message,
        String code,
        double discountAmount,
        double finalTotal
) {
}


