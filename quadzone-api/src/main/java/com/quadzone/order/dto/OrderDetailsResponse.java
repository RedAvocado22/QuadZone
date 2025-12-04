package com.quadzone.order.dto;

import com.quadzone.order.Order;
import com.quadzone.order.OrderStatus;

import java.time.LocalDateTime;
import java.util.List;

public record OrderDetailsResponse(
        Long id,
        String orderNumber,
        String customerName,
        String customerEmail,
        String customerPhone,
        Double totalAmount,
        OrderStatus status,
        LocalDateTime orderDate,
        int itemsCount,
        List<OrderItemResponse> items,
        Double subtotal,
        Double taxAmount,
        Double shippingCost,
        Double discountAmount,
        String address,
        String notes
) {
    public static OrderDetailsResponse from(Order order) {
        var user = order.getUser();
        String customerName;
        String customerEmail;
        String customerPhone;

        if (user != null) {
            customerName = (order.getCustomerFirstName() != null && order.getCustomerLastName() != null)
                    ? order.getCustomerFirstName() + " " + order.getCustomerLastName()
                    : user.getFullName();
            customerEmail = order.getCustomerEmail() != null ? order.getCustomerEmail() : user.getEmail();
            customerPhone = order.getCustomerPhone() != null ? order.getCustomerPhone() : null;
        } else {
            customerName = (order.getCustomerFirstName() != null && order.getCustomerLastName() != null)
                    ? order.getCustomerFirstName() + " " + order.getCustomerLastName()
                    : "Guest";
            customerEmail = order.getCustomerEmail();
            customerPhone = order.getCustomerPhone();
        }

        List<OrderItemResponse> items = order.getOrderItems() != null
                ? order.getOrderItems().stream().map(OrderItemResponse::from).toList()
                : List.of();

        return new OrderDetailsResponse(
                order.getId(),
                "ORD-" + String.format("%05d", order.getId()),
                customerName,
                customerEmail,
                customerPhone,
                order.getTotalAmount(),
                order.getOrderStatus(),
                order.getOrderDate(),
                items.size(),
                items,
                order.getSubtotal(),
                order.getTaxAmount(),
                order.getShippingCost(),
                order.getDiscountAmount(),
                order.getAddress(),
                order.getNotes()
        );
    }
}

