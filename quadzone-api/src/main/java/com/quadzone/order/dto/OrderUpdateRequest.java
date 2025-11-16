package com.quadzone.order.dto;

import com.quadzone.order.OrderStatus;

import java.math.BigDecimal;

public record OrderUpdateRequest(
        BigDecimal subtotal,
        BigDecimal taxAmount,
        BigDecimal shippingCost,
        BigDecimal discountAmount,
        BigDecimal totalAmount,
        OrderStatus orderStatus,
        String notes,
        String address
) {
}

