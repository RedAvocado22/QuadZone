package com.quadzone.product.review;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

//    @PostMapping
//    public ResponseEntity<ReviewDTO> createReview(@PathVariable Long productId,
//                                                  @Valid @RequestBody ReviewDTO reviewDTO,
//                                                  @AuthenticationPrincipal User user) {
//        if (user == null) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
//        }
//        ReviewDTO created = reviewService.createReview(productId, reviewDTO, user);
//        return ResponseEntity.status(HttpStatus.CREATED).body(created);
//    }
}
