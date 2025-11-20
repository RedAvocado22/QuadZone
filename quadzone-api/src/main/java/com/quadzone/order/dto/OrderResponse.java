package com.quadzone.order.dto;

import com.quadzone.order.Order;
import com.quadzone.order.OrderStatus;
import java.time.LocalDateTime;

public record OrderResponse(
        Long id,
        String orderNumber,
        String customerName,
        Double totalAmount,
        OrderStatus status,
        LocalDateTime orderDate,
        int itemsCount
) {
    public static OrderResponse from(Order order) {
        var user = order.getUser();
        var customerName = user != null ? user.getFullName() : "Guest";
        int itemsCount = order.getOrderItems() != null ? order.getOrderItems().size() : 0;
        return new OrderResponse(
                order.getId(),
                "ORD-" + String.format("%05d", order.getId()),
                customerName,
                order.getTotalAmount(),
                order.getOrderStatus(),
                order.getOrderDate(),
                itemsCount
        );
    }
}

