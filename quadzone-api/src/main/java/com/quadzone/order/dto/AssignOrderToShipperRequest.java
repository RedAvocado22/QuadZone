package com.quadzone.order.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record AssignOrderToShipperRequest(
        @NotNull(message = "Shipper ID is required")
        @Positive(message = "Shipper ID must be positive")
        Long shipperId,
        
        String trackingNumber,
        String deliveryNotes
) {
}

