package com.quadzone.wishlist;

import java.util.List;

import com.quadzone.product.dto.ProductResponse;
import com.quadzone.user.dto.UserResponse;

public record WishListResponse (
        Long id,
        UserResponse user,
        List<ProductResponse> products
) {
    public static WishListResponse from(WishList wishlist) {
        List<ProductResponse> productResponses = wishlist.getProducts()
                .stream()
                .map(ProductResponse::from)
                .toList();

        return new WishListResponse(
                wishlist.getId(),
                UserResponse.from(wishlist.getUser()),
                productResponses
        );
    }
}
