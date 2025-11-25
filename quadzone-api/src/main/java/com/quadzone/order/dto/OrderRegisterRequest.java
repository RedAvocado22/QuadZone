package com.quadzone.order.dto;

import com.quadzone.order.Order;
import com.quadzone.order.OrderStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.time.LocalDateTime;

public record OrderRegisterRequest(
        @NotNull(message = "User ID is required")
        Long userId,

        @PositiveOrZero(message = "Subtotal must be positive or zero")
        Double subtotal,

        @PositiveOrZero(message = "Tax amount must be positive or zero")
        Double taxAmount,

        @PositiveOrZero(message = "Shipping cost must be positive or zero")
        Double shippingCost,

        @PositiveOrZero(message = "Discount amount must be positive or zero")
        Double discountAmount,

        @NotNull(message = "Total amount is required")
        @PositiveOrZero(message = "Total amount must be positive or zero")
        Double totalAmount,

        OrderStatus orderStatus,

        String notes,
        String address
) {
    public static Order toOrder(OrderRegisterRequest request, com.quadzone.user.User user) {
        Order order = new Order();
        order.setOrderDate(LocalDateTime.now());
        order.setSubtotal(request.subtotal() != null ? request.subtotal() : 0);
        order.setTaxAmount(request.taxAmount() != null ? request.taxAmount() : 0);
        order.setShippingCost(request.shippingCost() != null ? request.shippingCost() : 0);
        order.setDiscountAmount(request.discountAmount() != null ? request.discountAmount() : 0);
        order.setTotalAmount(request.totalAmount());
        order.setOrderStatus(request.orderStatus() != null ? request.orderStatus() : OrderStatus.PENDING);
        order.setNotes(request.notes());
        order.setAddress(request.address());
        order.setUser(user);
        return order;
    }
}

