package com.quadzone.review;

import com.quadzone.order.Order;
import com.quadzone.order.OrderRepository;
import com.quadzone.order.OrderStatus;
import com.quadzone.product.Product;
import com.quadzone.product.ProductRepository;
import com.quadzone.review.dto.CheckReviewResponse;
import com.quadzone.review.dto.CreateReviewRequest;
import com.quadzone.review.dto.ReviewResponse;
import com.quadzone.review.dto.UpdateReviewRequest;
import com.quadzone.user.User;
import com.quadzone.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {
    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;

    public Page<ReviewResponse> getReviewsByProduct(Long productId, Pageable pageable) {
        Page<Review> page = reviewRepository.findByProductId(productId, pageable);
        return page.map(ReviewResponse::from);
    }

    /**
     * Check if the current user has reviewed a specific product
     */
    @Transactional(readOnly = true)
    public CheckReviewResponse checkUserReview(Long productId) {
        User user = getCurrentUser();
        
        return reviewRepository.findByUserIdAndProductId(user.getId(), productId)
                .map(review -> CheckReviewResponse.reviewed(ReviewResponse.from(review)))
                .orElse(CheckReviewResponse.notReviewed());
    }

    /**
     * Create a new review
     */
    @Transactional
    public ReviewResponse createReview(CreateReviewRequest request) {
        User user = getCurrentUser();
        
        // Check if user already reviewed this product
        if (reviewRepository.existsByUserIdAndProductId(user.getId(), request.productId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "You have already reviewed this product");
        }

        // Check if user has a completed order with this product
        boolean hasPurchased = hasCompletedOrderWithProduct(user, request.productId());
        if (!hasPurchased) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only review products you have purchased");
        }

        Product product = productRepository.findById(request.productId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));

        Review review = new Review();
        review.setRating(request.rating());
        review.setTitle(request.title());
        review.setText(request.text());
        review.setProduct(product);
        review.setUser(user);

        Review saved = reviewRepository.save(review);
        return ReviewResponse.from(saved);
    }

    /**
     * Update an existing review
     */
    @Transactional
    public ReviewResponse updateReview(Long reviewId, UpdateReviewRequest request) {
        User user = getCurrentUser();

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Review not found"));

        // Check if the review belongs to the user
        if (!review.getUser().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only update your own reviews");
        }

        if (request.rating() != null) {
            review.setRating(request.rating());
        }
        if (request.title() != null) {
            review.setTitle(request.title());
        }
        if (request.text() != null) {
            review.setText(request.text());
        }

        Review saved = reviewRepository.save(review);
        return ReviewResponse.from(saved);
    }

    /**
     * Delete a review
     */
    @Transactional
    public void deleteReview(Long reviewId) {
        User user = getCurrentUser();

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Review not found"));

        // Check if the review belongs to the user
        if (!review.getUser().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only delete your own reviews");
        }

        reviewRepository.delete(review);
    }

    /**
     * Get all reviews by the current user
     */
    @Transactional(readOnly = true)
    public List<ReviewResponse> getMyReviews() {
        User user = getCurrentUser();
        return reviewRepository.findByUserId(user.getId()).stream()
                .map(ReviewResponse::from)
                .toList();
    }

    /**
     * Check if user has a completed order containing the product
     */
    private boolean hasCompletedOrderWithProduct(User user, Long productId) {
        List<Order> completedOrders = orderRepository.findByUserIdAndOrderStatus(user.getId(), OrderStatus.COMPLETED);
        
        for (Order order : completedOrders) {
            if (order.getOrderItems() != null) {
                boolean hasProduct = order.getOrderItems().stream()
                        .anyMatch(item -> item.getProduct() != null && 
                                         item.getProduct().getId().equals(productId));
                if (hasProduct) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Get the currently authenticated user
     */
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() ||
                authentication.getName().equals("anonymousUser")) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not authenticated");
        }

        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }
}
