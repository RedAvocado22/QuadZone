package com.quadzone.review;

import com.quadzone.review.dto.ReviewDTO;
import com.quadzone.review.service.ReviewService;
import com.quadzone.user.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/reviews")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
@Tag(name = "Review API", description = "Product reviews")
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    @Operation(summary = "Create review for a product")
    public ResponseEntity<ReviewDTO> createReview(@PathVariable Long productId,
            @Valid @RequestBody ReviewDTO reviewDTO,
            @AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        ReviewDTO created = reviewService.createReview(productId, reviewDTO, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
}
