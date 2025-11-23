package com.quadzone.order.dto;

import com.quadzone.order.OrderStatus;
import java.time.LocalDateTime;

public record OrderStatusResponse(
        String orderNumber,
        String customerName,
        OrderStatus status,
        LocalDateTime orderDate,
        Double totalAmount,
        int itemsCount,
        String message
) {
    public static OrderStatusResponse from(OrderResponse orderResponse) {
        return new OrderStatusResponse(
                orderResponse.orderNumber(),
                orderResponse.customerName(),
                orderResponse.status(),
                orderResponse.orderDate(),
                orderResponse.totalAmount(),
                orderResponse.itemsCount(),
                "Order found successfully"
        );
    }
    
    public static OrderStatusResponse notFound(String orderNumber) {
        return new OrderStatusResponse(
                orderNumber,
                null,
                null,
                null,
                null,
                0,
                "Order not found. Please check your order number and try again."
        );
    }
}

