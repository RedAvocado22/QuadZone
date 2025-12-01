package com.quadzone.product;

import com.quadzone.global.dto.PagedResponse;
import com.quadzone.product.dto.ProductRegisterRequest;
import com.quadzone.product.dto.ProductResponse;
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
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
@Tag(name = "Product API", description = "Product management API providing comprehensive CRUD operations for products. "
                +
                "Supports product listing, creation, updates, and deletion with advanced search and pagination capabilities.")
public class ProductController {

        private final ProductService productService;

        @GetMapping
        @Operation(summary = "Get all products", description = "Retrieve a paginated list of all products in the system with optional search functionality. "
                        +
                        "Supports flexible pagination with configurable page size and comprehensive search by product name, brand, or description. "
                        +
                        "Results are sorted by creation date (newest first) and include complete product information.")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Successfully retrieved products list with pagination metadata"),
                        @ApiResponse(responseCode = "400", description = "Invalid pagination parameters (page < 0 or size < 1)"),
                        @ApiResponse(responseCode = "500", description = "Internal server error occurred while fetching products")
        })
        public ResponseEntity<PagedResponse<ProductResponse>> getProducts(
                        @Parameter(description = "Page number (0-indexed). Default is 0 for the first page", example = "0") @RequestParam(defaultValue = "0") int page,
                        @Parameter(description = "Number of products per page. Default is 10, maximum recommended is 100", example = "10") @RequestParam(defaultValue = "10") int size,
                        @Parameter(description = "Search query to filter products by name, brand, or description. Case-insensitive partial matching", example = "laptop") @RequestParam(defaultValue = "") String search) {
                return ResponseEntity.ok(productService.findProducts(page, size, search));
        }

        @GetMapping("/{id}")
        @Operation(summary = "Get product by ID", description = "Retrieve detailed information about a specific product using its unique identifier. "
                        +
                        "Returns complete product details including name, brand, price, stock quantity, images, " +
                        "category and subcategory information, and all associated metadata.")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Product found and returned successfully with all details"),
                        @ApiResponse(responseCode = "404", description = "Product not found with the provided ID"),
                        @ApiResponse(responseCode = "400", description = "Invalid product ID format (must be a positive number)")
        })
        public ResponseEntity<ProductResponse> getProduct(
                        @Parameter(description = "Unique identifier of the product to retrieve", example = "1", required = true) @PathVariable Long id) {
                return ResponseEntity.ok(productService.findByIdForAdmin(id));
        }

        @PostMapping
        @Operation(summary = "Create new product", description = "Create a new product in the system with all required information. "
                        +
                        "Requires product name, brand, price, stock quantity, image URL, and optional subcategory association. "
                        +
                        "All required fields must be valid and meet business rules. Returns the created product with its system-assigned unique identifier.")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "201", description = "Product created successfully and returned with assigned ID"),
                        @ApiResponse(responseCode = "400", description = "Invalid input data, validation failed, or missing required fields"),
                        @ApiResponse(responseCode = "409", description = "Product with similar name already exists in the system"),
                        @ApiResponse(responseCode = "500", description = "Internal server error occurred during product creation")
        })
        public ResponseEntity<ProductResponse> createProduct(
                        @Parameter(description = "Product registration request containing all product details (name, brand, price, stock, imageUrl, subCategory)", required = true) @Valid @RequestBody ProductRegisterRequest productDTO) {
                ProductResponse createdProduct = productService.createProduct(productDTO);
                return ResponseEntity.status(HttpStatus.CREATED).body(createdProduct);
        }

        @PutMapping("/{id}")
        @Operation(summary = "Update existing product", description = "Update an existing product's information. Supports partial updates - only the fields provided in the request will be modified. "
                        +
                        "The product must exist in the system. All provided fields will be validated before update. " +
                        "Returns the updated product with all current information including unchanged fields.")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Product updated successfully with modified information"),
                        @ApiResponse(responseCode = "404", description = "Product not found with the provided ID"),
                        @ApiResponse(responseCode = "400", description = "Invalid input data, validation failed, or invalid field values"),
                        @ApiResponse(responseCode = "500", description = "Internal server error occurred during product update")
        })
        public ResponseEntity<ProductResponse> updateProduct(
                        @Parameter(description = "Unique identifier of the product to update", example = "1", required = true) @PathVariable Long id,
                        @Parameter(description = "Product update request containing fields to modify (all fields optional)", required = true) @Valid @RequestBody ProductUpdateRequest productDTO) {
                try {
                        ProductResponse updatedProduct = productService.updateProduct(id, productDTO);
                        return ResponseEntity.ok(updatedProduct);
                } catch (RuntimeException e) {
                        return ResponseEntity.notFound().build();
                }
        }

        @DeleteMapping("/{id}")
        @Operation(summary = "Delete product", description = "Permanently delete a product from the system by its unique identifier. "
                        +
                        "This operation is irreversible and cannot be undone. " +
                        "Ensure the product is not referenced in active orders or other critical business processes before deletion.")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "204", description = "Product deleted successfully (no content returned)"),
                        @ApiResponse(responseCode = "404", description = "Product not found with the provided ID"),
                        @ApiResponse(responseCode = "409", description = "Product cannot be deleted (referenced in active orders or other constraints)"),
                        @ApiResponse(responseCode = "500", description = "Internal server error occurred during product deletion")
        })
        public ResponseEntity<Void> deleteProduct(
                        @Parameter(description = "Unique identifier of the product to delete", example = "1", required = true) @PathVariable Long id) {
                try {
                        productService.deleteProduct(id);
                        return ResponseEntity.noContent().build();
                } catch (RuntimeException e) {
                        return ResponseEntity.notFound().build();
                }
        }
}
