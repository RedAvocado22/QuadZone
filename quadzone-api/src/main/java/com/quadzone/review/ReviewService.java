package com.quadzone.review;

import com.quadzone.product.Product;
import com.quadzone.product.ProductRepository;
import com.quadzone.review.dto.ReviewDTO;
import com.quadzone.utils.EntityMapper;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Service
@RequiredArgsConstructor
public class ReviewService {
    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final EntityMapper objectMapper;

    public Page<ReviewDTO> getReviewsByProduct(Long productId,Pageable pageable) {
        Page<Review> page = reviewRepository.findByProductId(productId, pageable);
        return page.map(objectMapper::toReviewDTO);
    }

    @Transactional
    public ReviewDTO createReview(Long productId, ReviewDTO reviewDTO, com.quadzone.user.User user) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        Review review = new Review();
        review.setRating(reviewDTO.rating());
        review.setReviewTitle(reviewDTO.reviewTitle());
        review.setReviewText(reviewDTO.reviewText());
        review.setProduct(product);
        review.setUser(user);
        Review saved = reviewRepository.save(review);
        return objectMapper.toReviewDTO(saved);
    }

}
