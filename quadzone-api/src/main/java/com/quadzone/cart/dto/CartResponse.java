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
        List<CartItemResponse> items = cart.getItems() == null
                ? List.of()
                : cart.getItems().stream().map(CartItemResponse::from).toList();

        Long customerId = cart.getUser() != null ? cart.getUser().getId() : null;

        return new CartResponse(
                cart.getId(),
                customerId,
                cart.getUpdatedAt(),
                items);
    }
}