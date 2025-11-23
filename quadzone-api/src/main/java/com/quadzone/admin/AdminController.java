package com.quadzone.admin;

import com.quadzone.admin.dto.CategoryAdminResponse;
import com.quadzone.admin.dto.ProductAdminResponse;
import com.quadzone.global.dto.PagedResponse;
import com.quadzone.product.ProductService;
import com.quadzone.product.category.CategoryService;
import com.quadzone.product.category.dto.CategoryRegisterRequest;
import com.quadzone.product.category.dto.CategoryUpdateRequest;
import com.quadzone.product.dto.ProductRegisterRequest;
import com.quadzone.product.dto.ProductUpdateRequest;
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

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
@Tag(name = "Admin API", description = "Comprehensive admin management API for products and categories. Provides full CRUD operations with pagination, search, and filtering capabilities.")
public class AdminController {

    private final ProductService productService;
    private final CategoryService categoryService;

    @GetMapping("/products")
    @Operation(
            summary = "Get all products (Admin)",
            description = "Retrieve a paginated list of all products with optional search functionality. " +
                    "Supports pagination with configurable page size and search by product name, brand, or description. " +
                    "Returns a PagedResponse containing the product list, total count, and pagination metadata."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved products list"),
            @ApiResponse(responseCode = "400", description = "Invalid pagination parameters"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<PagedResponse<ProductAdminResponse>> getProducts(
            @Parameter(description = "Page number (0-indexed)", example = "0")
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Number of items per page", example = "10")
            @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "Search query to filter products by name, brand, or description", example = "laptop")
            @RequestParam(defaultValue = "") String search
    ) {
        return ResponseEntity.ok(productService.findProductsForAdmin(page, size, search));
    }

    @GetMapping("/products/{id}")
    @Operation(
            summary = "Get product by ID (Admin)",
            description = "Retrieve detailed information about a specific product by its unique identifier. " +
                    "Returns complete product details including name, brand, price, stock, images, and category information."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Product found and returned successfully"),
            @ApiResponse(responseCode = "404", description = "Product not found with the provided ID"),
            @ApiResponse(responseCode = "400", description = "Invalid product ID format")
    })
    public ResponseEntity<ProductAdminResponse> getProduct(
            @Parameter(description = "Unique identifier of the product", example = "1", required = true)
            @PathVariable Long id) {
        return ResponseEntity.ok(productService.findByIdForAdminWithDetails(id));
    }

    @PostMapping("/products")
    @Operation(
            summary = "Create new product (Admin)",
            description = "Create a new product in the system. Requires product details including name, brand, price, " +
                    "stock quantity, image URL, and optional subcategory. All required fields must be provided and valid. " +
                    "Returns the created product with its assigned unique identifier."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Product created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input data or validation failed"),
            @ApiResponse(responseCode = "409", description = "Product with similar name already exists"),
            @ApiResponse(responseCode = "500", description = "Internal server error during product creation")
    })
    public ResponseEntity<ProductAdminResponse> createProduct(
            @Parameter(description = "Product registration request containing all product details", required = true)
            @Valid @RequestBody ProductRegisterRequest productDTO) {
        ProductAdminResponse createdProduct = productService.createProductForAdmin(productDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdProduct);
    }

    @PutMapping("/products/{id}")
    @Operation(
            summary = "Update existing product (Admin)",
            description = "Update an existing product's information. Allows partial updates - only provided fields will be updated. " +
                    "Product must exist in the system. Returns the updated product with all current information."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Product updated successfully"),
            @ApiResponse(responseCode = "404", description = "Product not found with the provided ID"),
            @ApiResponse(responseCode = "400", description = "Invalid input data or validation failed"),
            @ApiResponse(responseCode = "500", description = "Internal server error during update")
    })
    public ResponseEntity<ProductAdminResponse> updateProduct(
            @Parameter(description = "Unique identifier of the product to update", example = "1", required = true)
            @PathVariable Long id,
            @Parameter(description = "Product update request with fields to modify", required = true)
            @Valid @RequestBody ProductUpdateRequest productDTO) {
        try {
            ProductAdminResponse updatedProduct = productService.updateProductForAdmin(id, productDTO);
            return ResponseEntity.ok(updatedProduct);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/products/{id}")
    @Operation(
            summary = "Delete product (Admin)",
            description = "Permanently delete a product from the system by its unique identifier. " +
                    "This operation cannot be undone. Ensure the product is not referenced in active orders before deletion."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Product deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Product not found with the provided ID"),
            @ApiResponse(responseCode = "409", description = "Product cannot be deleted (e.g., referenced in orders)"),
            @ApiResponse(responseCode = "500", description = "Internal server error during deletion")
    })
    public ResponseEntity<Void> deleteProduct(
            @Parameter(description = "Unique identifier of the product to delete", example = "1", required = true)
            @PathVariable Long id) {
        try {
            productService.deleteProduct(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/categories")
    @Operation(
            summary = "Get all categories (Admin)",
            description = "Retrieve a paginated list of all product categories with optional search functionality. " +
                    "Supports pagination and filtering by category name. " +
                    "Returns categories sorted alphabetically with their active status and product counts."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved categories list"),
            @ApiResponse(responseCode = "400", description = "Invalid pagination parameters"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<PagedResponse<CategoryAdminResponse>> getCategories(
            @Parameter(description = "Page number (0-indexed)", example = "0")
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Number of items per page", example = "10")
            @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "Search query to filter categories by name", example = "electronics")
            @RequestParam(defaultValue = "") String search
    ) {
        return ResponseEntity.ok(categoryService.findCategoriesForAdmin(page, size, search));
    }

    @GetMapping("/categories/{id}")
    @Operation(
            summary = "Get category by ID (Admin)",
            description = "Retrieve detailed information about a specific category by its unique identifier. " +
                    "Returns complete category details including name, active status, product count, and image URL."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Category found and returned successfully"),
            @ApiResponse(responseCode = "404", description = "Category not found with the provided ID"),
            @ApiResponse(responseCode = "400", description = "Invalid category ID format")
    })
    public ResponseEntity<CategoryAdminResponse> getCategory(
            @Parameter(description = "Unique identifier of the category", example = "1", required = true)
            @PathVariable Long id) {
        return ResponseEntity.ok(categoryService.findByIdForAdmin(id));
    }

    @PostMapping("/categories")
    @Operation(
            summary = "Create new category (Admin)",
            description = "Create a new product category in the system. Requires category name and optional image URL. " +
                    "Categories are used to organize products. Returns the created category with its assigned unique identifier."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Category created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input data or validation failed"),
            @ApiResponse(responseCode = "409", description = "Category with the same name already exists"),
            @ApiResponse(responseCode = "500", description = "Internal server error during category creation")
    })
    public ResponseEntity<CategoryAdminResponse> createCategory(
            @Parameter(description = "Category registration request containing category details", required = true)
            @Valid @RequestBody CategoryRegisterRequest categoryRegisterRequest) {
        CategoryAdminResponse createdCategory = categoryService.createCategoryForAdmin(categoryRegisterRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdCategory);
    }

    @PutMapping("/categories/{id}")
    @Operation(
            summary = "Update existing category (Admin)",
            description = "Update an existing category's information. Allows partial updates - only provided fields will be updated. " +
                    "Category must exist in the system. Can update name, active status, and image URL."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Category updated successfully"),
            @ApiResponse(responseCode = "404", description = "Category not found with the provided ID"),
            @ApiResponse(responseCode = "400", description = "Invalid input data or validation failed"),
            @ApiResponse(responseCode = "500", description = "Internal server error during update")
    })
    public ResponseEntity<CategoryAdminResponse> updateCategory(
            @Parameter(description = "Unique identifier of the category to update", example = "1", required = true)
            @PathVariable Long id,
            @Parameter(description = "Category update request with fields to modify", required = true)
            @Valid @RequestBody CategoryUpdateRequest categoryUpdateRequest) {
        try {
            CategoryAdminResponse updatedCategory = categoryService.updateCategoryForAdmin(id, categoryUpdateRequest);
            return ResponseEntity.ok(updatedCategory);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/categories/{id}")
    @Operation(
            summary = "Delete category (Admin)",
            description = "Permanently delete a category from the system by its unique identifier. " +
                    "This operation cannot be undone. Ensure the category has no associated products or subcategories before deletion."
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
}
