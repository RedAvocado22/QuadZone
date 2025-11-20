package com.quadzone.cart.service;

import org.springframework.stereotype.Service;

import com.quadzone.cart.Cart;
import com.quadzone.cart.CartItem;
import com.quadzone.cart.CartRepository;
import com.quadzone.product.Product;
import com.quadzone.product.ProductRepository;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;

    public CartService(CartRepository cartRepository, ProductRepository productRepository) {
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
    }

    public Cart getCartByUserId(Long userId) {
        // For simplicity, assuming cart exists, in real app handle creation if not exists
        return cartRepository.findById(userId).orElseThrow();
    }

    /**
     * Add a product to the user's cart.
     * If the product already exists in the cart, increment its quantity.
     * Otherwise, create a new cart item.
     *
     * @param cartId    The ID of the cart
     * @param productId The ID of the product to add
     * @param quantity  The quantity to add (default: 1)
     * @return The updated Cart
     * @throws RuntimeException if cart or product not found
     */
    public Cart addToCart(Long cartId, Long productId, Integer quantity) {
        if (quantity == null || quantity <= 0) {
            quantity = 1;
        }

        // Fetch cart and product
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart not found with id: " + cartId));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));

        // Check if product already exists in cart
        if (cart.getItems() != null) {
            for (CartItem item : cart.getItems()) {
                if (item.getProduct().getId().equals(productId)) {
                    // Product already in cart, increment quantity
                    item.setQuantity(item.getQuantity() + quantity);
                    return cartRepository.save(cart);
                }
            }
        }

        // Product not in cart, create new cart item
        CartItem cartItem = new CartItem();
        cartItem.setProduct(product);
        cartItem.setQuantity(quantity);
        cart.addCartItem(cartItem);

        return cartRepository.save(cart);
    }

    /**
     * Add a product to cart with default quantity of 1.
     *
     * @param cartId    The ID of the cart
     * @param productId The ID of the product to add
     * @return The updated Cart
     */
    public Cart addToCart(Long cartId, Long productId) {
        return addToCart(cartId, productId, 1);
    }

    /**
     * Remove a product completely from the cart.
     *
     * @param cartId    The ID of the cart
     * @param productId The ID of the product to remove
     * @return The updated Cart
     * @throws RuntimeException if cart not found or product not in cart
     */
    public Cart removeFromCart(Long cartId, Long productId) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart not found with id: " + cartId));

        if (cart.getItems() != null) {
            CartItem itemToRemove = null;
            for (CartItem item : cart.getItems()) {
                if (item.getProduct().getId().equals(productId)) {
                    itemToRemove = item;
                    break;
                }
            }

            if (itemToRemove != null) {
                cart.getItems().remove(itemToRemove);
                return cartRepository.save(cart);
            }
        }

        throw new RuntimeException("Product with id: " + productId + " not found in cart");
    }

    /**
     * Update the quantity of a product in the cart.
     * If quantity is 0 or less, the item is removed from cart.
     *
     * @param cartId    The ID of the cart
     * @param productId The ID of the product to update
     * @param quantity  The new quantity
     * @return The updated Cart
     * @throws RuntimeException if cart not found or product not in cart
     */
    public Cart updateQuantity(Long cartId, Long productId, Integer quantity) {
        if (quantity == null || quantity <= 0) {
            // Remove item if quantity is 0 or negative
            return removeFromCart(cartId, productId);
        }

        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart not found with id: " + cartId));

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

    /**
     * Clear all items from the cart.
     *
     * @param cartId The ID of the cart to clear
     * @return The cleared Cart
     * @throws RuntimeException if cart not found
     */
    public Cart clearCart(Long cartId) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart not found with id: " + cartId));

        if (cart.getItems() != null) {
            cart.getItems().clear();
        }

        return cartRepository.save(cart);
    }
}
