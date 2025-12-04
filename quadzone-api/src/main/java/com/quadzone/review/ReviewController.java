package com.quadzone.review;

import com.quadzone.review.dto.CheckReviewResponse;
import com.quadzone.review.dto.CreateReviewRequest;
import com.quadzone.review.dto.ReviewResponse;
import com.quadzone.review.dto.UpdateReviewRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/reviews")
@RequiredArgsConstructor
@Tag(name = "Review API", description = "Product review management API")
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping("/check/{productId}")
    @Operation(
            summary = "Check if user has reviewed a product",
            description = "Check if the currently authenticated user has already reviewed a specific product"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Check completed successfully"),
            @ApiResponse(responseCode = "401", description = "User not authenticated")
    })
    public ResponseEntity<CheckReviewResponse> checkUserReview(
            @Parameter(description = "Product ID to check", required = true)
            @PathVariable Long productId
    ) {
        return ResponseEntity.ok(reviewService.checkUserReview(productId));
    }

    @GetMapping("/my-reviews")
    @Operation(
            summary = "Get user's reviews",
            description = "Get all reviews created by the currently authenticated user"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Reviews retrieved successfully"),
            @ApiResponse(responseCode = "401", description = "User not authenticated")
    })
    public ResponseEntity<List<ReviewResponse>> getMyReviews() {
        return ResponseEntity.ok(reviewService.getMyReviews());
    }

    @PostMapping
    @Operation(
            summary = "Create a review",
            description = "Create a new review for a product. User must have purchased the product in a completed order."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Review created successfully"),
            @ApiResponse(responseCode = "400", description = "User has already reviewed this product"),
            @ApiResponse(responseCode = "401", description = "User not authenticated"),
            @ApiResponse(responseCode = "403", description = "User has not purchased this product"),
            @ApiResponse(responseCode = "404", description = "Product not found")
    })
    public ResponseEntity<ReviewResponse> createReview(
            @Parameter(description = "Review details", required = true)
            @Valid @RequestBody CreateReviewRequest request
    ) {
        ReviewResponse created = reviewService.createReview(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{reviewId}")
    @Operation(
            summary = "Update a review",
            description = "Update an existing review. User can only update their own reviews."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Review updated successfully"),
            @ApiResponse(responseCode = "401", description = "User not authenticated"),
            @ApiResponse(responseCode = "403", description = "User cannot update this review"),
            @ApiResponse(responseCode = "404", description = "Review not found")
    })
    public ResponseEntity<ReviewResponse> updateReview(
            @Parameter(description = "Review ID to update", required = true)
            @PathVariable Long reviewId,
            @Parameter(description = "Updated review details", required = true)
            @Valid @RequestBody UpdateReviewRequest request
    ) {
        return ResponseEntity.ok(reviewService.updateReview(reviewId, request));
    }

    @DeleteMapping("/{reviewId}")
    @Operation(
            summary = "Delete a review",
            description = "Delete an existing review. User can only delete their own reviews."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Review deleted successfully"),
            @ApiResponse(responseCode = "401", description = "User not authenticated"),
            @ApiResponse(responseCode = "403", description = "User cannot delete this review"),
            @ApiResponse(responseCode = "404", description = "Review not found")
    })
    public ResponseEntity<Void> deleteReview(
            @Parameter(description = "Review ID to delete", required = true)
            @PathVariable Long reviewId
    ) {
        reviewService.deleteReview(reviewId);
        return ResponseEntity.noContent().build();
    }
}
