package com.quadzone.cart.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.quadzone.cart.Cart;

public record CartResponse(
        Long id,
        Long customerId,
        LocalDateTime updateAt,
        List<CartItemResponse> cart_item_list) {
    public static CartResponse from(Cart cart) {
        return new CartResponse(
                cart.getId(),
                cart.getUser().getId(),
                cart.getUpdatedAt(),
                cart.getItems().stream().map(CartItemResponse::from).toList());
    }
}