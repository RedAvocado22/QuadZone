package com.quadzone.product.category;

import com.quadzone.global.dto.PagedResponse;
import com.quadzone.product.category.dto.CategoryRegisterRequest;
import com.quadzone.product.category.dto.CategoryResponse;
import com.quadzone.product.category.dto.CategoryUpdateRequest;
import com.quadzone.product.category.sub_category.dto.SubCategoryRegisterRequest;
import com.quadzone.product.category.sub_category.dto.SubCategoryResponse;
import com.quadzone.product.category.sub_category.dto.SubCategoryUpdateRequest;
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
@RequestMapping("/api/v1/categories")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
@Tag(name = "Category API", description = "Category management API for organizing products. " +
        "Provides comprehensive CRUD operations for product categories with admin and public endpoints. " +
        "Categories help structure and organize the product catalog.")
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping("/admin")
    @Operation(
            summary = "Get all categories (Admin)",
            description = "Retrieve a paginated list of all categories with optional search functionality for admin users. " +
                    "Returns categories sorted alphabetically with their active status, product counts, and image URLs. " +
                    "Supports comprehensive search and flexible pagination."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved categories list with pagination metadata"),
            @ApiResponse(responseCode = "400", description = "Invalid pagination parameters"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<PagedResponse<CategoryResponse>> getCategories(
            @Parameter(description = "Page number (0-indexed)", example = "0")
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Number of items per page", example = "10")
            @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "Search query to filter categories by name", example = "electronics")
            @RequestParam(defaultValue = "") String search
    ) {
        return ResponseEntity.ok(categoryService.findCategories(page, size, search));
    }

    @GetMapping("/admin/{id}")
    @Operation(
            summary = "Get category by ID (Admin)",
            description = "Retrieve detailed information about a specific category by its unique identifier for admin users. " +
                    "Returns complete category details including name, active status, product count, and image URL."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Category found and returned successfully"),
            @ApiResponse(responseCode = "404", description = "Category not found with the provided ID"),
            @ApiResponse(responseCode = "400", description = "Invalid category ID format")
    })
    public ResponseEntity<CategoryResponse> getCategoryForAdmin(
            @Parameter(description = "Unique identifier of the category", example = "1", required = true)
            @PathVariable Long id) {
        return ResponseEntity.ok(categoryService.findById(id));
    }

    @PostMapping("/admin")
    @Operation(
            summary = "Create category (Admin)",
            description = "Create a new product category in the system for admin users. " +
                    "Requires category name and optional image URL. Categories are used to organize and structure the product catalog. " +
                    "Returns the created category with its assigned unique identifier."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Category created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input data or validation failed"),
            @ApiResponse(responseCode = "409", description = "Category with the same name already exists"),
            @ApiResponse(responseCode = "500", description = "Internal server error during category creation")
    })
    public ResponseEntity<CategoryResponse> createCategory(
            @Parameter(description = "Category registration request containing category details", required = true)
            @Valid @RequestBody CategoryRegisterRequest categoryRegisterRequest) {
        CategoryResponse createdCategory = categoryService.createCategory(categoryRegisterRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdCategory);
    }

    @GetMapping("/{id}")
    @Operation(
            summary = "Get category by ID",
            description = "Retrieve detailed information about a specific category by its unique identifier. " +
                    "Public endpoint that returns category details including name, active status, and associated product information."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Category found and returned successfully"),
            @ApiResponse(responseCode = "404", description = "Category not found with the provided ID"),
            @ApiResponse(responseCode = "400", description = "Invalid category ID format")
    })
    public ResponseEntity<CategoryResponse> getCategory(
            @Parameter(description = "Unique identifier of the category", example = "1", required = true)
            @PathVariable Long id) {
        return ResponseEntity.ok(categoryService.getCategory(id));
    }

    @PutMapping("/{id}")
    @Operation(
            summary = "Update category",
            description = "Update an existing category's information. Allows partial updates - only provided fields will be modified. " +
                    "Category must exist in the system. Can update name, active status, and image URL."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Category updated successfully"),
            @ApiResponse(responseCode = "404", description = "Category not found with the provided ID"),
            @ApiResponse(responseCode = "400", description = "Invalid input data or validation failed"),
            @ApiResponse(responseCode = "500", description = "Internal server error during update")
    })
    public ResponseEntity<CategoryResponse> updateCategory(
            @Parameter(description = "Unique identifier of the category to update", example = "1", required = true)
            @PathVariable Long id,
            @Parameter(description = "Category update request with fields to modify", required = true)
            @Valid @RequestBody CategoryUpdateRequest categoryUpdateRequest) {
        try {
            CategoryResponse updatedCategory = categoryService.updateCategory(id, categoryUpdateRequest);
            return ResponseEntity.ok(updatedCategory);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @Operation(
            summary = "Delete category",
            description = "Permanently delete a category from the system by its unique identifier. " +
                    "This operation is irreversible. Ensure the category has no associated products or subcategories before deletion."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Category deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Category not found with the provided ID"),
            @ApiResponse(responseCode = "409", description = "Category cannot be deleted (has associated products or subcategories)"),
            @ApiResponse(responseCode = "500", description = "Internal server error during deletion")
    })
    public ResponseEntity<Void> deleteCategory(
            @Parameter(description = "Unique identifier of the category to delete", example = "1", required = true)
            @PathVariable Long id) {
        try {
            categoryService.deleteCategory(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    @GetMapping("/admin/all")
    public List<CategoryResponse> getAllCategories() {
        return categoryService.getAllCategories();
    }

    @GetMapping("/{categoryId}/subcategories")
    public ResponseEntity<List<SubCategoryResponse>> getSubCategoriesByCategoryId(
            @PathVariable Long categoryId
    ) {
        List<SubCategoryResponse> subCategories = categoryService.getSubCategoriesByCategoryId(categoryId);
        return ResponseEntity.ok(subCategories);
    }

    @PostMapping("/{categoryId}/subcategories")
    public ResponseEntity<SubCategoryResponse> createSubCategory(
            @PathVariable Long categoryId,
            @Valid @RequestBody SubCategoryRegisterRequest request
    ) {
        SubCategoryResponse created = categoryService.createSubCategory(categoryId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{categoryId}/subcategories/{subId}")
    public ResponseEntity<SubCategoryResponse> updateSubCategory(
            @PathVariable Long categoryId,
            @PathVariable Long subId,
            @Valid @RequestBody SubCategoryUpdateRequest request
    ) {
        SubCategoryResponse updated = categoryService.updateSubCategory(categoryId, subId, request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{categoryId}/subcategories/{subId}")
    public ResponseEntity<Void> deleteSubCategory(
            @PathVariable Long categoryId,
            @PathVariable Long subId
    ) {
        categoryService.deleteSubCategory(categoryId, subId);
        return ResponseEntity.noContent().build();
    }
}
