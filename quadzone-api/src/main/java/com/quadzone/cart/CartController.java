package com.quadzone.cart;

import org.springframework.http.HttpStatus;
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

    // --------------------------
    //      GET CART
    // --------------------------
    @GetMapping("/{userId}")
    public ResponseEntity<CartResponse> getCart(@PathVariable Long userId) {
        Cart cart = cartService.getCartByUserId(userId);
        return ResponseEntity.ok(CartResponse.from(cart));
    }

    // --------------------------
    //      ADD TO CART
    // --------------------------
    @PostMapping("/{userId}/add")
    public ResponseEntity<CartResponse> addToCart(
            @PathVariable Long userId,
            @Valid @RequestBody AddToCartRequest request) {

        Cart cart = cartService.addToCart(userId, request.productId(), request.quantity());
        return ResponseEntity.ok(CartResponse.from(cart));
    }

    // Quick add (quantity = 1)
    @PostMapping("/{userId}/add/{productId}")
    public ResponseEntity<CartResponse> quickAddToCart(
            @PathVariable Long userId,
            @PathVariable Long productId) {

        Cart cart = cartService.addToCart(userId, productId);
        return ResponseEntity.ok(CartResponse.from(cart));
    }

    // --------------------------
    //     REMOVE FROM CART
    // --------------------------
    @DeleteMapping("/{userId}/remove/{productId}")
    public ResponseEntity<CartResponse> removeFromCart(
            @PathVariable Long userId,
            @PathVariable Long productId) {

        Cart cart = cartService.removeFromCart(userId, productId);
        return ResponseEntity.ok(CartResponse.from(cart));
    }

    // --------------------------
    //     UPDATE QUANTITY
    // --------------------------
    @PatchMapping("/{userId}/update/{productId}")
    public ResponseEntity<CartResponse> updateQuantity(
            @PathVariable Long userId,
            @PathVariable Long productId,
            @RequestParam Integer quantity) {

        Cart cart = cartService.updateQuantity(userId, productId, quantity);
        return ResponseEntity.ok(CartResponse.from(cart));
    }

    // --------------------------
    //      CLEAR CART
    // --------------------------
    @DeleteMapping("/{userId}/clear")
    public ResponseEntity<CartResponse> clearCart(@PathVariable Long userId) {
        Cart cart = cartService.clearCart(userId);
        return ResponseEntity.ok(CartResponse.from(cart));
    }

    // --------------------------
    //    GLOBAL CART EXCEPTION HANDLER
    // --------------------------
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<String> handleRuntime(RuntimeException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
    }
}
