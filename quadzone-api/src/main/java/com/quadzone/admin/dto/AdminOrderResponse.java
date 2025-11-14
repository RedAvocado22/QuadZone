package com.quadzone.admin.dto;

import com.quadzone.order.OrderStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record AdminOrderResponse(
        Long id,
        String orderNumber,
        String customerName,
        BigDecimal totalAmount,
        OrderStatus status,
        LocalDateTime orderDate,
        int itemsCount
) {
}

