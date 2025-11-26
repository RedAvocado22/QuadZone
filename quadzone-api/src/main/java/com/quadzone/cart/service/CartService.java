package com.quadzone.cart.service;

import org.springframework.stereotype.Service;

import com.quadzone.cart.Cart;
import com.quadzone.cart.CartItem;
import com.quadzone.cart.CartRepository;
import com.quadzone.product.Product;
import com.quadzone.product.ProductRepository;
import com.quadzone.user.User;
import com.quadzone.user.UserRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import com.quadzone.cart.dto.CartItemRequest;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public CartService(CartRepository cartRepository, ProductRepository productRepository,
            UserRepository userRepository) {
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    // --------------------------
    // PRIVATE UTILITY METHOD
    // --------------------------
    private Cart getOrCreateCart(Long userId) {
        // Find cart by user
        return cartRepository.findByUserId(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

                    Cart cart = new Cart();
                    cart.setUser(user);
                    return cartRepository.save(cart);
                });
    }

    // --------------------------
    // GET CART
    // --------------------------
    public Cart getCartByUserId(Long userId) {
        return getOrCreateCart(userId);
    }

    // --------------------------
    // ADD TO CART
    // --------------------------
    public Cart addToCart(Long userId, Long productId, Integer quantity) {

        if (quantity == null || quantity <= 0) {
            quantity = 1;
        }

        Cart cart = getOrCreateCart(userId);

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));

        // If exists → increment quantity
        if (cart.getItems() != null) {
            for (CartItem item : cart.getItems()) {
                if (item.getProduct().getId().equals(productId)) {
                    item.setQuantity(item.getQuantity() + quantity);
                    return cartRepository.save(cart);
                }
            }
        }

        // Else → create new item
        CartItem cartItem = new CartItem();
        cartItem.setProduct(product);
        cartItem.setQuantity(quantity);

        cart.addCartItem(cartItem);
        return cartRepository.save(cart);
    }

    public Cart addToCart(Long userId, Long productId) {
        return addToCart(userId, productId, 1);
    }

    // --------------------------
    // REMOVE FROM CART
    // --------------------------
    public Cart removeFromCart(Long userId, Long productId) {
        Cart cart = getOrCreateCart(userId);

        CartItem itemToRemove = null;

        if (cart.getItems() != null) {
            for (CartItem item : cart.getItems()) {
                if (item.getProduct().getId().equals(productId)) {
                    itemToRemove = item;
                    break;
                }
            }
        }

        if (itemToRemove == null) {
            throw new RuntimeException("Product with id: " + productId + " not found in cart");
        }

        cart.getItems().remove(itemToRemove);
        return cartRepository.save(cart);
    }

    // --------------------------
    // UPDATE QUANTITY
    // --------------------------
    public Cart updateQuantity(Long userId, Long productId, Integer quantity) {

        if (quantity == null || quantity <= 0) {
            return removeFromCart(userId, productId);
        }

        Cart cart = getOrCreateCart(userId);

        if (cart.getItems() != null) {
            for (CartItem item : cart.getItems()) {
                if (item.getProduct().getId().equals(productId)) {
                    item.setQuantity(quantity);
                    return cartRepository.save(cart);
                }
            }
        }

        throw new RuntimeException("Product with id: " + productId + " not found in cart");
    }

    // --------------------------
    // CLEAR CART
    // --------------------------
    public Cart clearCart(Long userId) {
        Cart cart = getOrCreateCart(userId);

        if (cart.getItems() != null) {
            cart.getItems().clear();
        }

        return cartRepository.save(cart);
    }

    public Cart mergeCart(User user, List<CartItemRequest> localItems) {
        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUser(user);
                    return cartRepository.save(newCart);
                });

        List<CartItem> dbItems = cart.getItems();
        if (dbItems == null) {
            dbItems = new ArrayList<>();
            cart.setItems(dbItems);
        }

        for (CartItemRequest localItem : localItems) {
            Product product = productRepository.findById(localItem.productId())
                    .orElseThrow(() -> new RuntimeException("Product not found with id: " + localItem.productId()));

            Optional<CartItem> existingItemOpt = dbItems.stream()
                    .filter(item -> item.getProduct().getId().equals(localItem.productId()))
                    .findFirst();

            if (existingItemOpt.isPresent()) {
                CartItem existingItem = existingItemOpt.get();
                int newQuantity = existingItem.getQuantity() + localItem.quantity();

                existingItem.setQuantity(newQuantity);
            } else {
                CartItem newItem = new CartItem();
                newItem.setCart(cart);
                newItem.setProduct(product);
                newItem.setQuantity(localItem.quantity());

                cart.addCartItem(newItem);
            }
        }

        return cartRepository.save(cart);
    }
}