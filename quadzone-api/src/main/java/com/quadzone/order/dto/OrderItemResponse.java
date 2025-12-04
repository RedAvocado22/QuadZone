package com.quadzone.order.dto;

import com.quadzone.order.OrderItem;

public record OrderItemResponse(
        Long id,
        Long productId,
        String productName,
        String productImageUrl,
        Integer quantity,
        Double price,
        Double totalPrice
) {
    public static OrderItemResponse from(OrderItem orderItem) {
        var product = orderItem.getProduct();
        return new OrderItemResponse(
                orderItem.getId(),
                product != null ? product.getId() : null,
                product != null ? product.getName() : "Unknown Product",
                product != null ? product.getImageUrl() : null,
                orderItem.getQuantity(),
                orderItem.getPriceAtPurchase() != null ? orderItem.getPriceAtPurchase().doubleValue() : 0.0,
                orderItem.getPriceAtPurchase() != null && orderItem.getQuantity() != null 
                        ? orderItem.getPriceAtPurchase().doubleValue() * orderItem.getQuantity() 
                        : 0.0
        );
    }
}

