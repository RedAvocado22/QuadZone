package com.quadzone.review;

import com.quadzone.product.Product;
import com.quadzone.product.ProductRepository;
import com.quadzone.review.dto.ReviewDTO;
import com.quadzone.utils.EntityMapper;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReviewService {
    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final EntityMapper objectMapper;

    public org.springframework.data.domain.Page<com.quadzone.review.dto.ReviewDTO> getReviewsByProduct(
            Long productId,
            org.springframework.data.domain.Pageable pageable) {
        org.springframework.data.domain.Page<Review> page = reviewRepository.findByProductId(productId,
                pageable);
        return page.map(objectMapper::toReviewDTO);
    }

    @Transactional
    public ReviewDTO createReview(Long productId, ReviewDTO reviewDTO, com.quadzone.user.User user) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        Review review = new Review();
        review.setRating(reviewDTO.getRating());
        review.setReviewTitle(reviewDTO.getReviewTitle());
        review.setReviewText(reviewDTO.getReviewText());
        review.setProduct(product);
        review.setUser(user);
        Review saved = reviewRepository.save(review);
        return objectMapper.toReviewDTO(saved);
    }

}
