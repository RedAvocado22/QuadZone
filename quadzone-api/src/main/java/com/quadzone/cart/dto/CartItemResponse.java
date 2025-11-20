package com.quadzone.cart.dto;

import java.time.LocalDateTime;

import com.quadzone.cart.CartItem;
import com.quadzone.product.dto.ProductResponse;

public record CartItemResponse(
    Long id,
    Integer quantity,
    LocalDateTime addedAt,
    ProductResponse productResponse

) {
    public static CartItemResponse from(CartItem cartItem) {
        return new CartItemResponse(
            cartItem.getId(),
            cartItem.getQuantity(),
            cartItem.getAddedAt(),
            ProductResponse.from(cartItem.getProduct())
        );
    }
}
