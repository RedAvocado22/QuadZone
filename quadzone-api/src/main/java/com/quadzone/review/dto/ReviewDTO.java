package com.quadzone.review.dto;

import com.quadzone.review.Review;

import java.time.LocalDateTime;

public record ReviewDTO(
        long id,
        int rating,
        String reviewTitle,
        String reviewText,
        LocalDateTime updateAt,
        LocalDateTime createdAt,
        String productName,
        String userName
) {
    public static ReviewDTO from(Review review) {
        return new ReviewDTO(
                review.getId(),
                review.getRating(),
                review.getReviewTitle(),
                review.getReviewText(),
                review.getUpdatedAt(),
                review.getCreatedAt(),
                review.getProduct().getName(),
                review.getUser().getFullName()
        );
    }
}
