package com.quadzone.discount.dto;

public record CouponValidationRequest(
        String code,
        Double subtotal
) {
}


