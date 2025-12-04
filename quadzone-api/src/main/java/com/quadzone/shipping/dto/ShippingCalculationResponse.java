package com.quadzone.shipping.dto;

public record ShippingCalculationResponse(
        double shippingCost,
        String message
) {
}

