package com.quadzone.order.dto;

import com.quadzone.order.OrderStatus;

public record OrderUpdateRequest(
        Double subtotal,
        Double taxAmount,
        Double shippingCost,
        Double discountAmount,
        Double totalAmount,
        OrderStatus orderStatus,
        String notes,
        String address
) {
}

