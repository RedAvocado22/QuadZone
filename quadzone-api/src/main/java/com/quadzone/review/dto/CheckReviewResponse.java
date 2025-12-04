package com.quadzone.review.dto;

public record CheckReviewResponse(
        boolean hasReviewed,
        ReviewResponse review
) {
    public static CheckReviewResponse notReviewed() {
        return new CheckReviewResponse(false, null);
    }

    public static CheckReviewResponse reviewed(ReviewResponse review) {
        return new CheckReviewResponse(true, review);
    }
}
