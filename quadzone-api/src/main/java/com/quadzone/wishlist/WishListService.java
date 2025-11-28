package com.quadzone.wishlist;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.quadzone.product.Product;
import com.quadzone.product.ProductRepository;
import com.quadzone.user.User;
import com.quadzone.user.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class WishListService {
    private final WishlistRepository wishlistRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    // =================================================
    // Helper method: Get or create wishlist for user
    // =================================================
    private WishList getOrCreateWishlist(Long userId) {
        return Optional.ofNullable(wishlistRepository.findByUserId(userId))
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new RuntimeException("User not found"));

                    WishList newWishlist = new WishList();
                    newWishlist.setUser(user);

                    return wishlistRepository.save(newWishlist);
                });
    }

    // =================================================
    // GET: View wishlist
    // =================================================
    public WishListResponse getWishlistByUserId(Long userId) {
        WishList wishlist = getOrCreateWishlist(userId);
        return WishListResponse.from(wishlist);
    }

    // =================================================
    // ADD product to wishlist
    // =================================================
    public WishListResponse addProduct(Long userId, Long productId) {

        WishList wishlist = getOrCreateWishlist(userId);

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // ✅ Check if product already exists in wishlist
        boolean exists = wishlist.getProducts().stream()
                .anyMatch(p -> p.getId().equals(productId));

        if (exists) {
            throw new RuntimeException("Product is already in wishlist");
        }

        wishlist.getProducts().add(product);

        wishlistRepository.save(wishlist);

        return WishListResponse.from(wishlist);
    }

    // =================================================
    // REMOVE product from wishlist
    // =================================================
    public WishListResponse removeProduct(Long userId, Long productId) {

        WishList wishlist = getOrCreateWishlist(userId);

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Remove product if it exists
        wishlist.getProducts().remove(product);

        wishlistRepository.save(wishlist);

        return WishListResponse.from(wishlist);
    }

    // =================================================
    // CLEAR wishlist
    // =================================================
    public void clearWishlist(Long userId) {

        WishList wishlist = getOrCreateWishlist(userId);

        wishlist.getProducts().clear();
        wishlistRepository.save(wishlist);
    }
}
