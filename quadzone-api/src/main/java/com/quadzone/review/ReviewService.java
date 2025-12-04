package com.quadzone.review;

import com.quadzone.product.Product;
import com.quadzone.product.ProductRepository;
import com.quadzone.review.dto.ReviewResponse;
import com.quadzone.utils.EntityMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ReviewService {
    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final EntityMapper objectMapper;

    public Page<ReviewResponse> getReviewsByProduct(Long productId, Pageable pageable) {
        Page<Review> page = reviewRepository.findByProductId(productId, pageable);
        return page.map(objectMapper::toReviewResponse);
    }

    @Transactional
    public ReviewResponse createReview(Long productId, ReviewResponse reviewResponse, com.quadzone.user.User user) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        Review review = new Review();
        review.setRating(reviewResponse.rating());
        review.setTitle(reviewResponse.title());
        review.setContent(reviewResponse.content());
        review.setProduct(product);
        review.setUser(user);
        Review saved = reviewRepository.save(review);
        return objectMapper.toReviewResponse(saved);
    }

}
