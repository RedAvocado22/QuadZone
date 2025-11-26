package com.quadzone.wishlist;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.quadzone.user.User;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/wishlist")
@RequiredArgsConstructor
public class WishListController {
    private final WishListService wishListService;

    // ===========================
    // GET: View wishlist by current user
    // ===========================
    @GetMapping
    public ResponseEntity<WishListResponse> getWishlist(
            @AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        WishListResponse response = wishListService.getWishlistByUserId(user.getId());
        return ResponseEntity.ok(response);
    }

    // ===========================
    // POST: Add product to wishlist
    // ===========================
    @PostMapping("/{productId}")
    public ResponseEntity<WishListResponse> addProductToWishlist(
            @AuthenticationPrincipal User user,
            @PathVariable Long productId
    ) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        WishListResponse response = wishListService.addProduct(user.getId(), productId);
        return ResponseEntity.ok(response);
    }

    // ===========================
    // DELETE: Remove product from wishlist
    // ===========================
    @DeleteMapping("/{productId}")
    public ResponseEntity<WishListResponse> removeProductFromWishlist(
            @AuthenticationPrincipal User user,
            @PathVariable Long productId
    ) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        WishListResponse response = wishListService.removeProduct(user.getId(), productId);
        return ResponseEntity.ok(response);
    }

    // ===========================
    // DELETE: Clear wishlist
    // ===========================
    @DeleteMapping("/clear")
    public ResponseEntity<String> clearWishlist(
            @AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        wishListService.clearWishlist(user.getId());
        return ResponseEntity.ok("Wishlist cleared successfully.");
    }
}
