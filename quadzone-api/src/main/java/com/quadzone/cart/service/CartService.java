package com.quadzone.cart.service;

import org.springframework.stereotype.Service;

import com.quadzone.cart.Cart;
import com.quadzone.cart.CartRepository;

@Service
public class CartService {

    private final CartRepository cartRepository;

    public CartService(CartRepository cartRepository) {
        this.cartRepository = cartRepository;
    }

    public Cart getCartByUserId(Long userId) {
        // For simplicity, assuming cart exists, in real app handle creation if not exists
        return cartRepository.findById(userId).orElseThrow();
    }
    
}
