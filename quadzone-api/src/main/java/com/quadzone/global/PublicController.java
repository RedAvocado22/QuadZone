package com.quadzone.global;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.quadzone.product.dto.ProductDTO;
import com.quadzone.product.service.ProductService;
import com.quadzone.review.dto.ReviewDTO;
import com.quadzone.review.service.ReviewService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/public")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
@Tag(name = "Public API", description = "Public API")
public class PublicController {

    private final ReviewService reviewService;
    private final ProductService productService;

    @GetMapping("products/{productId}/reviews")
    @Operation(summary = "List reviews for a product")
    public ResponseEntity<Page<ReviewDTO>> listReviews(
            @PathVariable("productId") Long productId,
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "10") @Min(1) @Max(100) int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<ReviewDTO> reviews = reviewService.getReviewsByProduct(productId, pageable);
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("products")
    @Operation(summary = "List products", description = "Get a paginated list of products with optional search")
    @ApiResponse(responseCode = "200", description = "Successful operation")
    public ResponseEntity<Page<ProductDTO>> listProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String q,
            @RequestParam(defaultValue = "id") String sort) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ProductDTO> products = productService.listProducts(pageable, q);
        return ResponseEntity.ok(products);
    }

    @GetMapping("products/{id}")
    @Operation(summary = "Get product by ID", description = "Retrieve a single product by its ID")
    @ApiResponse(responseCode = "200", description = "Product found")
    @ApiResponse(responseCode = "404", description = "Product not found")
    public ResponseEntity<ProductDTO> getProduct(@PathVariable Long id) {
        try {
            ProductDTO product = productService.getProduct(id);
            return ResponseEntity.ok(product);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
