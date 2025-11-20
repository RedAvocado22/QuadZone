package com.quadzone.global;

import com.quadzone.global.dto.HomeResponse;
import com.quadzone.product.ProductService;
import com.quadzone.product.category.CategoryRepository;
import com.quadzone.product.category.CategoryService;
import com.quadzone.product.category.dto.CategoryResponse;
import com.quadzone.product.dto.ProductDetailsResponse;
import com.quadzone.product.dto.ProductResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/public")
@RequiredArgsConstructor
public class PublicController {

    private final ProductService productService;
    private final CategoryRepository categoryRepository;
    private final CategoryService categoryService;

    @GetMapping()
    public ResponseEntity<HomeResponse> getHome() {
        Page<ProductResponse> featured = productService.getFeaturedProducts(PageRequest.of(0, 8));
        Page<ProductResponse> bestSellers = productService.getBestSellers(PageRequest.of(0, 8));
        Page<ProductResponse> newArrivals = productService.getArrivals(PageRequest.of(0, 8));

        List<CategoryResponse> categories = categoryService.findAll();

        return ResponseEntity.ok(new HomeResponse(categories, featured, bestSellers, newArrivals));
    }

    @GetMapping("/products")
    public ResponseEntity<Page<ProductResponse>> listProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String q,
            @RequestParam(defaultValue = "id") String sort) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ProductResponse> products = productService.getProducts(pageable, q);
        return ResponseEntity.ok(products);
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
}
