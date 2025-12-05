package com.quadzone.global;

import com.quadzone.blog.BlogService;
import com.quadzone.blog.dto.BlogDetailResponse;
import com.quadzone.blog.dto.BlogOverviewResponse;
import com.quadzone.global.dto.HomeResponse;
import com.quadzone.global.dto.PagedResponse;
import com.quadzone.product.ProductService;
import com.quadzone.product.category.CategoryRepository;
import com.quadzone.product.category.CategoryService;
import com.quadzone.product.category.dto.CategoryResponse;
import com.quadzone.product.dto.BrandResponse;
import com.quadzone.product.dto.ProductDetailsResponse;
import com.quadzone.product.dto.ProductResponse;
import com.quadzone.review.ReviewService;
import com.quadzone.review.dto.ReviewResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/v1/public")
@RequiredArgsConstructor
public class PublicController {

    private final ProductService productService;
    private final CategoryRepository categoryRepository;
    private final CategoryService categoryService;
    private final BlogService blogService;
    private final ReviewService reviewService;

    @GetMapping()
    public ResponseEntity<HomeResponse> getHome() {
        Page<ProductResponse> featured = productService.getFeaturedProducts(PageRequest.of(0, 8));
        Page<ProductResponse> bestSellers = productService.getBestSellers(PageRequest.of(0, 8));
        Page<ProductResponse> newArrivals = productService.getArrivals(PageRequest.of(0, 8));

        List<CategoryResponse> categories = categoryService.getAllCategories();

        return ResponseEntity.ok(new HomeResponse(categories, featured, bestSellers, newArrivals));
    }

    @GetMapping("/products")
    public ResponseEntity<Page<ProductResponse>> listProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long subcategoryId,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) String sortBy) {

        Sort sort = buildSort(sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);

        // If search query is provided, use the search method
        if (search != null && !search.trim().isEmpty()) {
            Page<ProductResponse> response = productService.getProducts(pageable, search.trim());
            return ResponseEntity.ok(response);
        }

        // Otherwise use the filter-based search
        Page<ProductResponse> response = productService.searchProducts(
                brand,
                categoryId,
                subcategoryId,
                minPrice,
                maxPrice,
                pageable
        );

        return ResponseEntity.ok(response);
    }

    private Sort buildSort(String sortBy) {
        if (sortBy == null || sortBy.isEmpty()) {
            return Sort.unsorted();
        }

        String[] sortFields = sortBy.split(",");
        List<Sort.Order> orders = new ArrayList<>();
        for (String field : sortFields) {
            String[] parts = field.trim().split(":");
            String property = parts[0];
            Sort.Direction direction = parts.length > 1 && "desc".equalsIgnoreCase(parts[1])
                    ? Sort.Direction.DESC
                    : Sort.Direction.ASC;
            orders.add(new Sort.Order(direction, property));
        }
        return Sort.by(orders);
    }

    @GetMapping("/products/{id}")
    public ResponseEntity<ProductDetailsResponse> getProduct(@PathVariable Long id) {
        try {
            ProductDetailsResponse product = productService.getProducts(id);
            return ResponseEntity.ok(product);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/products/brands")
    public ResponseEntity<List<BrandResponse>> listBrands() {
        return ResponseEntity.ok(productService.listBrands());
    }

    @GetMapping("/categories/names")
    public ResponseEntity<List<CategoryResponse>> viewCategoriesName() {
        try {
            List<CategoryResponse> categories = categoryService.getAllCategories();
            return ResponseEntity.ok(categories);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/blogs")
    @Operation(summary = "Get all blog posts")
    public ResponseEntity<PagedResponse<BlogOverviewResponse>> getBlogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<BlogOverviewResponse> blogs = blogService.getBlogs(pageable);
        return ResponseEntity.ok(PagedResponse.of(
                blogs.getContent(),
                blogs.getTotalElements(),
                blogs.getNumber(),
                blogs.getSize()
        ));
    }

    /**
     * Get blog by slug
     */
    @GetMapping("/blogs/{slug}")
    @Operation(summary = "Get blog post by slug")
    public ResponseEntity<BlogDetailResponse> getBlogBySlug(@PathVariable String slug) {
        BlogDetailResponse blog = blogService.getBlogBySlug(slug);
        return ResponseEntity.ok(blog);
    }

    /**
     * Get recent blog posts (alias for /api/v1/public/blogs with default params)
     */
    @GetMapping("/blog")
    @Operation(summary = "Get recent blog posts")
    public ResponseEntity<PagedResponse<BlogOverviewResponse>> getRecentBlogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<BlogOverviewResponse> blogs = blogService.getBlogs(pageable);
        return ResponseEntity.ok(PagedResponse.of(
                blogs.getContent(),
                blogs.getTotalElements(),
                blogs.getNumber(),
                blogs.getSize()
        ));
    }

    /**
     * Add a comment to a blog post
     */
    @PostMapping("/blogs/{blogId}/comments")
    @Operation(summary = "Add a comment to a blog post")
    public ResponseEntity<Void> addCommentToBlog(
            @PathVariable Long blogId,
            @RequestBody com.quadzone.blog.comment.dto.AddCommentRequest request) {
        blogService.addCommentToBlog(blogId, request);
        return ResponseEntity.ok().build();
    }

    // ==================== REVIEWS ENDPOINTS ====================

    /**
     * Get reviews for a product
     */
    @GetMapping("/products/{productId}/reviews")
    @Operation(summary = "Get reviews for a product", description = "Retrieve paginated reviews for a specific product")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved reviews"),
            @ApiResponse(responseCode = "404", description = "Product not found"),
            @ApiResponse(responseCode = "400", description = "Invalid pagination parameters")
    })
    public ResponseEntity<Page<ReviewResponse>> getProductReviews(
            @Parameter(description = "Product ID", example = "1", required = true)
            @PathVariable Long productId,
            @Parameter(description = "Page number (0-indexed)", example = "0")
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Number of items per page", example = "10")
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ReviewResponse> reviews = reviewService.getReviewsByProduct(productId, pageable);
        return ResponseEntity.ok(reviews);
    }

}
