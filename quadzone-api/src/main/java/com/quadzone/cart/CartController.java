package com.quadzone.cart;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.quadzone.cart.dto.AddToCartRequest;
import com.quadzone.cart.dto.CartResponse;
import com.quadzone.cart.service.CartService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    /**
     * Get cart by user ID
     * 
     * @param userId The user ID
     * @return CartResponse with all cart items
     */
    @GetMapping("/{userId}")
    public ResponseEntity<CartResponse> getCart(@PathVariable Long userId) {
        try {
            Cart cart = cartService.getCartByUserId(userId);
            return ResponseEntity.ok(CartResponse.from(cart));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Add a product to cart
     * 
     * @param userId The user ID (cart ID)
     * @param request AddToCartRequest containing productId and quantity
     * @return Updated CartResponse
     */
    @PostMapping("/{userId}/add")
    public ResponseEntity<CartResponse> addToCart(
            @PathVariable Long userId,
            @Valid @RequestBody AddToCartRequest request) {
        try {
            Cart cart = cartService.addToCart(userId, request.productId(), request.quantity());
            return ResponseEntity.ok(CartResponse.from(cart));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    /**
     * Quick add to cart with default quantity of 1
     * 
     * @param userId The user ID (cart ID)
     * @param productId The product ID to add
     * @return Updated CartResponse
     */
    @PostMapping("/{userId}/add/{productId}")
    public ResponseEntity<CartResponse> quickAddToCart(
            @PathVariable Long userId,
            @PathVariable Long productId) {
        try {
            Cart cart = cartService.addToCart(userId, productId);
            return ResponseEntity.ok(CartResponse.from(cart));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    /**
     * Remove a product from cart
     * 
     * @param userId The user ID (cart ID)
     * @param productId The product ID to remove
     * @return Updated CartResponse
     */
    @DeleteMapping("/{userId}/remove/{productId}")
    public ResponseEntity<CartResponse> removeFromCart(
            @PathVariable Long userId,
            @PathVariable Long productId) {
        try {
            Cart cart = cartService.removeFromCart(userId, productId);
            return ResponseEntity.ok(CartResponse.from(cart));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    /**
     * Update product quantity in cart
     * 
     * @param userId The user ID (cart ID)
     * @param productId The product ID to update
     * @param quantity The new quantity (0 or negative to remove)
     * @return Updated CartResponse
     */
    @PatchMapping("/{userId}/update/{productId}")
    public ResponseEntity<CartResponse> updateQuantity(
            @PathVariable Long userId,
            @PathVariable Long productId,
            @RequestParam Integer quantity) {
        try {
            Cart cart = cartService.updateQuantity(userId, productId, quantity);
            return ResponseEntity.ok(CartResponse.from(cart));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    /**
     * Clear all items from cart
     * 
     * @param userId The user ID (cart ID)
     * @return Updated CartResponse
     */
    @DeleteMapping("/{userId}/clear")
    public ResponseEntity<CartResponse> clearCart(@PathVariable Long userId) {
        try {
            Cart cart = cartService.clearCart(userId);
            return ResponseEntity.ok(CartResponse.from(cart));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
}
