package com.quadzone.review.dto;

import com.quadzone.review.Review;

import java.time.LocalDateTime;

public record ReviewResponse(
        Long id,
        Integer rating,
        String title,
        String text,
        LocalDateTime createdAt,
        String userName,
        Long userId
) {
    public static ReviewResponse from(final Review review) {
        return new ReviewResponse(
                review.getId(),
                review.getRating(),
                review.getTitle(),
                review.getText(),
                review.getCreatedAt(),
                review.getUser().getFullName(),
                review.getUser().getId()
        );
    }
}
