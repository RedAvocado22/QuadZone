package com.quadzone.order.dto;

import com.quadzone.order.Order;
import com.quadzone.order.OrderStatus;
import java.time.LocalDateTime;

public record OrderResponse(
        Long id,
        String orderNumber,
        String customerName,
        String customerEmail,
        String customerPhone,
        Double totalAmount,
        OrderStatus status,
        LocalDateTime orderDate,
        int itemsCount
) {
    public static OrderResponse from(Order order) {
        var user = order.getUser();
        String customerName;
        String customerEmail;
        String customerPhone;
        
        if (user != null) {
            // Use user info if available, but prefer snapshot if exists
            customerName = (order.getCustomerFirstName() != null && order.getCustomerLastName() != null)
                    ? order.getCustomerFirstName() + " " + order.getCustomerLastName()
                    : user.getFullName();
            customerEmail = order.getCustomerEmail() != null ? order.getCustomerEmail() : user.getEmail();
            customerPhone = order.getCustomerPhone() != null ? order.getCustomerPhone() : null;
        } else {
            // Guest checkout - use snapshot
            customerName = (order.getCustomerFirstName() != null && order.getCustomerLastName() != null)
                    ? order.getCustomerFirstName() + " " + order.getCustomerLastName()
                    : "Guest";
            customerEmail = order.getCustomerEmail();
            customerPhone = order.getCustomerPhone();
        }
        
        int itemsCount = order.getOrderItems() != null ? order.getOrderItems().size() : 0;
        return new OrderResponse(
                order.getId(),
                "ORD-" + String.format("%05d", order.getId()),
                customerName,
                customerEmail,
                customerPhone,
                order.getTotalAmount(),
                order.getOrderStatus(),
                order.getOrderDate(),
                itemsCount
        );
    }
}

