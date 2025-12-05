package com.quadzone.order.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.LocalDateTime;

public record AssignOrderToShipperRequest(
        @NotNull(message = "Shipper ID is required")
        @Positive(message = "Shipper ID must be positive")
        Long shipperId,
        String trackingNumber,
        String carrier,
        LocalDateTime estimatedDeliveryDate,
        String deliveryNotes
) {
}

