package com.quadzone.product.category;

import com.quadzone.global.dto.PagedResponse;
import com.quadzone.product.category.dto.CategoryRegisterRequest;
import com.quadzone.product.category.dto.CategoryResponse;
import com.quadzone.product.category.dto.CategoryUpdateRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/categories")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
@Tag(name = "Category API", description = "API for managing categories")
public class CategoryController {

    private final CategoryService categoryService;

    // Admin endpoints
    @GetMapping("/admin")
    @Operation(summary = "Get all categories (Admin)", description = "Get all categories with pagination and search")
    @ApiResponse(responseCode = "200", description = "Categories returned")
    public ResponseEntity<PagedResponse<CategoryResponse>> getCategories(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "") String search
    ) {
        return ResponseEntity.ok(categoryService.findCategories(page, size, search));
    }

    @GetMapping("/admin/{id}")
    @Operation(summary = "Get category by ID (Admin)", description = "Get a category by ID for admin")
    @ApiResponse(responseCode = "200", description = "Category returned")
    @ApiResponse(responseCode = "404", description = "Category not found")
    public ResponseEntity<CategoryResponse> getCategoryForAdmin(@PathVariable Long id) {
        return ResponseEntity.ok(categoryService.findById(id));
    }

    @PostMapping("/admin")
    @Operation(summary = "Create category (Admin)", description = "Create a new category for admin")
    @ApiResponse(responseCode = "201", description = "Category created")
    @ApiResponse(responseCode = "400", description = "Invalid input")
    public ResponseEntity<CategoryResponse> createCategory(@Valid @RequestBody CategoryRegisterRequest categoryRegisterRequest) {
        CategoryResponse createdCategory = categoryService.createCategory(categoryRegisterRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdCategory);
    }

    // Regular endpoints
    @GetMapping("/{id}")
    @Operation(summary = "Get category by ID", description = "Get a category by ID")
    @ApiResponse(responseCode = "200", description = "Category returned")
    @ApiResponse(responseCode = "404", description = "Category not found")
    public ResponseEntity<CategoryResponse> getCategory(@PathVariable Long id) {
        return ResponseEntity.ok(categoryService.getCategory(id));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update category", description = "Update an existing category")
    @ApiResponse(responseCode = "200", description = "Category updated")
    @ApiResponse(responseCode = "404", description = "Category not found")
    @ApiResponse(responseCode = "400", description = "Invalid input")
    public ResponseEntity<CategoryResponse> updateCategory(@PathVariable Long id, @Valid @RequestBody CategoryUpdateRequest categoryUpdateRequest) {
        try {
            CategoryResponse updatedCategory = categoryService.updateCategory(id, categoryUpdateRequest);
            return ResponseEntity.ok(updatedCategory);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete category", description = "Delete a category by ID")
    @ApiResponse(responseCode = "204", description = "Category deleted")
    @ApiResponse(responseCode = "404", description = "Category not found")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        try {
            categoryService.deleteCategory(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}

