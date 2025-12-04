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
        Double subtotal,
        Double taxAmount,
        Double shippingCost,
        Double discountAmount,
        Double totalAmount,
        OrderStatus status,
        LocalDateTime orderDate,
        int itemsCount,
        String address,
        String notes
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
        
        // Use stored orderNumber, fallback to generated if null (for legacy orders)
        String orderNum = order.getOrderNumber() != null 
                ? order.getOrderNumber() 
                : "ORD-" + String.format("%05d", order.getId());
        
        return new OrderResponse(
                order.getId(),
                orderNum,
                customerName,
                customerEmail,
                customerPhone,
                order.getSubtotal(),
                order.getTaxAmount(),
                order.getShippingCost(),
                order.getDiscountAmount(),
                order.getTotalAmount(),
                order.getOrderStatus(),
                order.getOrderDate(),
                itemsCount,
                order.getAddress(),
                order.getNotes()
        );
    }
}

