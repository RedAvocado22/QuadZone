package com.quadzone.admin;

import com.quadzone.admin.dto.AdminDashboardAnalyticsResponse;
import com.quadzone.admin.dto.CategoryAdminResponse;
import com.quadzone.admin.dto.NewsItemResponse;
import com.quadzone.admin.dto.ProductAdminResponse;
import com.quadzone.blog.BlogService;
import com.quadzone.blog.comment.Comment;
import com.quadzone.blog.comment.CommentRepository;
import com.quadzone.blog.dto.AddBlogRequest;
import com.quadzone.blog.dto.BlogDetailResponse;
import com.quadzone.blog.dto.BlogStatusUpdateRequest;
import com.quadzone.blog.dto.UpdateBlogRequest;
import com.quadzone.global.dto.PagedResponse;
import com.quadzone.order.Order;
import com.quadzone.order.OrderRepository;
import com.quadzone.payment.Payment;
import com.quadzone.payment.PaymentRepository;
import com.quadzone.payment.PaymentStatus;
import com.quadzone.product.ProductService;
import com.quadzone.product.category.CategoryService;
import com.quadzone.product.category.dto.CategoryRegisterRequest;
import com.quadzone.product.category.dto.CategoryResponse;
import com.quadzone.product.category.dto.CategoryUpdateRequest;
import com.quadzone.product.category.sub_category.SubCategoryService;
import com.quadzone.product.category.sub_category.dto.SubCategoryAdminResponse;
import com.quadzone.product.category.sub_category.dto.SubCategoryRegisterRequest;
import com.quadzone.product.category.sub_category.dto.SubCategoryUpdateRequest;
import com.quadzone.product.dto.ProductRegisterRequest;
import com.quadzone.product.dto.ProductUpdateRequest;
import com.quadzone.shipping.Delivery;
import com.quadzone.shipping.DeliveryRepository;
import com.quadzone.shipping.DeliveryStatus;
import com.quadzone.upload.dto.UploadResponse;
import com.quadzone.upload.dto.UploadUpdateRequest;
import com.quadzone.upload.service.UploadService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
@Tag(name = "Admin API", description = "Comprehensive admin management API for products, categories, and image uploads. Provides full CRUD operations with pagination, search, and filtering capabilities.")
public class AdminController {

    private final ProductService productService;
    private final CategoryService categoryService;
    private final SubCategoryService subCategoryService;
    private final UploadService uploadService;
    private final AdminAnalyticsService adminAnalyticsService;
    private final BlogService blogService;
    private final CommentRepository commentRepository;
    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;
    private final DeliveryRepository deliveryRepository;

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
            @RequestParam(defaultValue = "") String search,
            @Parameter(description = "Sort by field and direction (e.g., 'price:asc', 'createdAt:desc')", example = "createdAt:desc")
            @RequestParam(required = false) String sortBy
    ) {
        return ResponseEntity.ok(productService.findProductsForAdmin(page, size, search, sortBy));
    }

    @GetMapping("/dashboard/analytics")
    @Operation(
            summary = "Get monthly analytics (Admin)",
            description = "Retrieve monthly aggregated analytics for sales, users, orders, and messages for the last N months."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved dashboard analytics"),
            @ApiResponse(responseCode = "400", description = "Invalid parameters"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<AdminDashboardAnalyticsResponse> getDashboardAnalytics(
            @Parameter(description = "Number of months to include", example = "12")
            @RequestParam(defaultValue = "12") int months
    ) {
        return ResponseEntity.ok(adminAnalyticsService.getDashboardAnalytics(months));
    }

    @GetMapping("/products/{id}")
    @Operation(summary = "Get product by ID (Admin)", description = "Retrieve detailed information about a specific product by its unique identifier. "
            +
            "Returns complete product details including name, brand, price, stock, images, and category information.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Product found and returned successfully"),
            @ApiResponse(responseCode = "404", description = "Product not found with the provided ID"),
            @ApiResponse(responseCode = "400", description = "Invalid product ID format")
    })
    public ResponseEntity<ProductAdminResponse> getProduct(
            @Parameter(description = "Unique identifier of the product", example = "1", required = true) @PathVariable Long id) {
        return ResponseEntity.ok(productService.findByIdForAdminWithDetails(id));
    }

    @GetMapping("/news")
    @Operation(
            summary = "Get recent admin news",
            description = "Aggregated recent events for admin dashboard, including new comments, new orders, and order status changes."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved admin news")
    })
    public ResponseEntity<List<NewsItemResponse>> getAdminNews(
            @Parameter(description = "Max number of items to return", example = "20")
            @RequestParam(defaultValue = "20") int size
    ) {
        int perSource = Math.max(1, Math.min(size, 20));

        Pageable latestCommentsPage = PageRequest.of(0, perSource, Sort.by(Sort.Direction.DESC, "createdAt"));
        Pageable latestOrdersPage = PageRequest.of(0, perSource, Sort.by(Sort.Direction.DESC, "orderDate"));
        Pageable latestPaymentsPage = PageRequest.of(0, perSource, Sort.by(Sort.Direction.DESC, "paymentDate"));
        Pageable latestDeliveryPage = PageRequest.of(0, perSource, Sort.by(Sort.Direction.DESC, "updatedAt"));

        final List<NewsItemResponse> items = new java.util.ArrayList<>();

        // New comments
        commentRepository.findAll(latestCommentsPage).forEach((Comment c) -> {
            String blogTitle = c.getBlog() != null ? c.getBlog().getTitle() : "Blog";
            items.add(new NewsItemResponse(
                    "comment_added",
                    "New blog comment",
                    c.getAuthorName() + " commented on \"" + blogTitle + "\"",
                    c.getCreatedAt(),
                    "blog_comment",
                    c.getId()
            ));
        });

        // New orders
        orderRepository.findAll(latestOrdersPage).forEach((Order o) -> {
            String orderNum = o.getOrderNumber() != null ? o.getOrderNumber() : ("ORD-" + String.format("%05d", o.getId()));
            String customerName = o.getCustomerFirstName() != null && o.getCustomerLastName() != null
                    ? o.getCustomerFirstName() + " " + o.getCustomerLastName()
                    : (o.getUser() != null ? o.getUser().getFullName() : "Guest");
            items.add(new NewsItemResponse(
                    "order_created",
                    "New order",
                    "Order #" + orderNum + " by " + customerName,
                    o.getOrderDate(),
                    "order",
                    o.getId()
            ));
        });

        // Order confirmed via payment
        paymentRepository.findByPaymentStatus(PaymentStatus.COMPLETED, latestPaymentsPage)
                .forEach((Payment p) -> {
                    Order o = p.getOrder();
                    String orderNum = o.getOrderNumber() != null ? o.getOrderNumber() : ("ORD-" + String.format("%05d", o.getId()));
                    items.add(new NewsItemResponse(
                            "order_status",
                            "Order Confirmed",
                            "Order #" + orderNum + " payment completed",
                            p.getPaymentDate(),
                            "order",
                            o.getId()
                    ));
                });

        // Delivery status changes
        deliveryRepository.findAll(latestDeliveryPage).forEach((Delivery d) -> {
            Order o = d.getOrder();
            String orderNum = o.getOrderNumber() != null ? o.getOrderNumber() : ("ORD-" + String.format("%05d", o.getId()));
            DeliveryStatus status = d.getDeliveryStatus();
            items.add(new NewsItemResponse(
                    "order_status",
                    "Delivery Updated",
                    "Order #" + orderNum + " delivery status: " + (status != null ? status.name() : "UNKNOWN"),
                    d.getUpdatedAt() != null ? d.getUpdatedAt() : d.getCreatedAt(),
                    "delivery",
                    d.getId()
            ));
        });

        items.sort((a, b) -> b.timestamp().compareTo(a.timestamp()));
        List<NewsItemResponse> result = items.size() > size ? items.subList(0, size) : items;
        return ResponseEntity.ok(result);
    }

    @PostMapping("/products")
    @Operation(summary = "Create new product (Admin)", description = "Create a new product in the system. Requires product details including name, brand, price, "
            +
            "stock quantity, image URL, and optional subcategory. All required fields must be provided and valid. "
            +
            "Returns the created product with its assigned unique identifier.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Product created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input data or validation failed"),
            @ApiResponse(responseCode = "409", description = "Product with similar name already exists"),
            @ApiResponse(responseCode = "500", description = "Internal server error during product creation")
    })
    public ResponseEntity<ProductAdminResponse> createProduct(
            @Parameter(description = "Product registration request containing all product details", required = true) @Valid @RequestBody ProductRegisterRequest productDTO) {
        ProductAdminResponse createdProduct = productService.createProductForAdmin(productDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdProduct);
    }

    @PutMapping("/products/{id}")
    @Operation(summary = "Update existing product (Admin)", description = "Update an existing product's information. Allows partial updates - only provided fields will be updated. "
            +
            "Product must exist in the system. Returns the updated product with all current information.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Product updated successfully"),
            @ApiResponse(responseCode = "404", description = "Product not found with the provided ID"),
            @ApiResponse(responseCode = "400", description = "Invalid input data or validation failed"),
            @ApiResponse(responseCode = "500", description = "Internal server error during update")
    })
    public ResponseEntity<ProductAdminResponse> updateProduct(
            @Parameter(description = "Unique identifier of the product to update", example = "1", required = true) @PathVariable Long id,
            @Parameter(description = "Product update request with fields to modify", required = true) @Valid @RequestBody ProductUpdateRequest productDTO) {
        try {
            ProductAdminResponse updatedProduct = productService.updateProductForAdmin(id, productDTO);
            return ResponseEntity.ok(updatedProduct);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/products/{id}")
    @Operation(summary = "Delete product (Admin)", description = "Permanently delete a product from the system by its unique identifier. "
            +
            "This operation cannot be undone. Ensure the product is not referenced in active orders before deletion.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Product deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Product not found with the provided ID"),
            @ApiResponse(responseCode = "409", description = "Product cannot be deleted (e.g., referenced in orders)"),
            @ApiResponse(responseCode = "500", description = "Internal server error during deletion")
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

    @GetMapping("/categories")
    @Operation(summary = "Get all categories (Admin)", description = "Retrieve a paginated list of all product categories with optional search functionality. "
            +
            "Supports pagination and filtering by category name. " +
            "Returns categories sorted alphabetically with their active status and product counts.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved categories list"),
            @ApiResponse(responseCode = "400", description = "Invalid pagination parameters"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<PagedResponse<CategoryAdminResponse>> getCategories(
            @Parameter(description = "Page number (0-indexed)", example = "0") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Number of items per page", example = "10") @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "Search query to filter categories by name", example = "electronics") @RequestParam(defaultValue = "") String search) {
        return ResponseEntity.ok(categoryService.findCategories(page, size, search));
    }

    @GetMapping("/categories/all")
    public List<CategoryResponse> getAllCategories() {
        return categoryService.getAllCategories();
    }

    @GetMapping("/categories/{id}")
    @Operation(summary = "Get category by ID (Admin)", description = "Retrieve detailed information about a specific category by its unique identifier. "
            +
            "Returns complete category details including name, active status, product count, and image URL.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Category found and returned successfully"),
            @ApiResponse(responseCode = "404", description = "Category not found with the provided ID"),
            @ApiResponse(responseCode = "400", description = "Invalid category ID format")
    })
    public ResponseEntity<CategoryAdminResponse> getCategory(
            @Parameter(description = "Unique identifier of the category", example = "1", required = true) @PathVariable Long id) {
        return ResponseEntity.ok(categoryService.findByIdForAdmin(id));
    }

    @PostMapping("/categories")
    @Operation(summary = "Create new category (Admin)", description = "Create a new product category in the system. Requires category name and optional image URL. "
            +
            "Categories are used to organize products. Returns the created category with its assigned unique identifier.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Category created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input data or validation failed"),
            @ApiResponse(responseCode = "409", description = "Category with the same name already exists"),
            @ApiResponse(responseCode = "500", description = "Internal server error during category creation")
    })
    public ResponseEntity<CategoryAdminResponse> createCategory(
            @Parameter(description = "Category registration request containing category details", required = true) @Valid @RequestBody CategoryRegisterRequest categoryRegisterRequest) {
        CategoryAdminResponse createdCategory = categoryService.createCategoryForAdmin(categoryRegisterRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdCategory);
    }

    @PutMapping("/categories/{id}")
    @Operation(summary = "Update existing category (Admin)", description = "Update an existing category's information. Allows partial updates - only provided fields will be updated. "
            +
            "Category must exist in the system. Can update name, active status, and image URL.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Category updated successfully"),
            @ApiResponse(responseCode = "404", description = "Category not found with the provided ID"),
            @ApiResponse(responseCode = "400", description = "Invalid input data or validation failed"),
            @ApiResponse(responseCode = "500", description = "Internal server error during update")
    })
    public ResponseEntity<CategoryAdminResponse> updateCategory(
            @Parameter(description = "Unique identifier of the category to update", example = "1", required = true) @PathVariable Long id,
            @Parameter(description = "Category update request with fields to modify", required = true) @Valid @RequestBody CategoryUpdateRequest categoryUpdateRequest) {
        try {
            CategoryAdminResponse updatedCategory = categoryService.updateCategoryForAdmin(id,
                    categoryUpdateRequest);
            return ResponseEntity.ok(updatedCategory);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/categories/{id}")
    @Operation(summary = "Delete category (Admin)", description = "Permanently delete a category from the system by its unique identifier. "
            +
            "This operation cannot be undone. Ensure the category has no associated products or subcategories before deletion.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Category deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Category not found with the provided ID"),
            @ApiResponse(responseCode = "409", description = "Category cannot be deleted (has associated products or subcategories)"),
            @ApiResponse(responseCode = "500", description = "Internal server error during deletion")
    })
    public ResponseEntity<Void> deleteCategory(
            @Parameter(description = "Unique identifier of the category to delete", example = "1", required = true) @PathVariable Long id) {
        try {
            categoryService.deleteCategory(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping(value = "/upload/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload image (Admin)", description = "Upload an image file to ImgBB and store its metadata. Accepts image files up to 50MB. "
            +
            "Returns the uploaded image URL and metadata including thumbnail URL.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Image uploaded successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid file or file format"),
            @ApiResponse(responseCode = "500", description = "Internal server error during upload")
    })
    public ResponseEntity<UploadResponse> uploadImage(
            @Parameter(description = "Image file to upload", required = true) @RequestParam("file") MultipartFile file,
            @Parameter(description = "Optional description for the image") @RequestParam(value = "description", required = false) String description) {
        UploadResponse response = uploadService.uploadImage(file, description);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/upload")
    @Operation(summary = "Get all uploaded images (Admin)", description = "Retrieve a paginated list of all uploaded images with optional search functionality. "
            +
            "Supports pagination and filtering by file name. Returns image metadata including URLs and descriptions.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved uploads list"),
            @ApiResponse(responseCode = "400", description = "Invalid pagination parameters"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<PagedResponse<UploadResponse>> getAllUploads(
            @Parameter(description = "Page number (0-indexed)", example = "0") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Number of items per page", example = "10") @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "Search query to filter uploads by file name", example = "image") @RequestParam(defaultValue = "") String search) {
        return ResponseEntity.ok(uploadService.getAllUploads(page, size, search));
    }

    @GetMapping("/upload/{id}")
    @Operation(summary = "Get uploaded image by ID (Admin)", description = "Retrieve detailed information about a specific uploaded image by its unique identifier. "
            +
            "Returns complete image metadata including URLs, file size, and upload timestamp.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Upload found and returned successfully"),
            @ApiResponse(responseCode = "404", description = "Upload not found with the provided ID"),
            @ApiResponse(responseCode = "400", description = "Invalid upload ID format")
    })
    public ResponseEntity<UploadResponse> getUploadById(
            @Parameter(description = "Unique identifier of the upload", example = "1", required = true) @PathVariable Long id) {
        return ResponseEntity.ok(uploadService.getUploadById(id));
    }

    @PutMapping("/upload/{id}")
    @Operation(summary = "Update uploaded image metadata (Admin)", description = "Update metadata of an existing uploaded image (e.g., description). "
            +
            "Note: This does not replace the image file itself, only updates metadata.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Upload updated successfully"),
            @ApiResponse(responseCode = "404", description = "Upload not found with the provided ID"),
            @ApiResponse(responseCode = "400", description = "Invalid input data or validation failed"),
            @ApiResponse(responseCode = "500", description = "Internal server error during update")
    })
    public ResponseEntity<UploadResponse> updateUpload(
            @Parameter(description = "Unique identifier of the upload to update", example = "1", required = true) @PathVariable Long id,
            @Parameter(description = "Upload update request with fields to modify", required = true) @Valid @RequestBody UploadUpdateRequest request) {
        try {
            UploadResponse updatedUpload = uploadService.updateUpload(id, request);
            return ResponseEntity.ok(updatedUpload);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/upload/{id}")
    @Operation(summary = "Delete uploaded image record (Admin)", description = "Delete an uploaded image record from the database. "
            +
            "This removes the metadata record but note that the image may still exist on ImgBB servers.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Upload deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Upload not found with the provided ID"),
            @ApiResponse(responseCode = "500", description = "Internal server error during deletion")
    })
    public ResponseEntity<Void> deleteUpload(
            @Parameter(description = "Unique identifier of the upload to delete", example = "1", required = true) @PathVariable Long id) {
        try {
            uploadService.deleteUpload(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/subcategories")
    @Operation(summary = "Get all subcategories (Admin)", description = "Retrieve a paginated list of all subcategories with optional search functionality. "
            +
            "Supports pagination with configurable page size. " +
            "Returns subcategories sorted alphabetically with their active status, product counts, and category information.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved subcategories list"),
            @ApiResponse(responseCode = "400", description = "Invalid pagination parameters"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<PagedResponse<SubCategoryAdminResponse>> getSubcategories(
            @Parameter(description = "Page number (0-indexed)", example = "0") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Number of items per page", example = "10") @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "Search query to filter subcategories by name", example = "laptop") @RequestParam(defaultValue = "") String search) {
        return ResponseEntity.ok(categoryService.findAllSubCategoriesForAdmin(page, size, search));
    }

    @GetMapping("/subcategories/{id}")
    @Operation(summary = "Get subcategory by ID (Admin)", description = "Retrieve detailed information about a specific subcategory by its unique identifier. "
            +
            "Returns complete subcategory details including name, active status, product count, description, and parent category information.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Subcategory found and returned successfully"),
            @ApiResponse(responseCode = "404", description = "Subcategory not found with the provided ID"),
            @ApiResponse(responseCode = "400", description = "Invalid subcategory ID format")
    })
    public ResponseEntity<SubCategoryAdminResponse> getSubcategory(
            @Parameter(description = "Unique identifier of the subcategory", example = "1", required = true) @PathVariable Long id) {
        return ResponseEntity.ok(categoryService.findSubCategoryByIdForAdmin(id));
    }

    @PostMapping("/subcategories")
    @Operation(summary = "Create new subcategory (Admin)", description = "Create a new subcategory under an existing category. Requires subcategory name, parent category ID, and optional active status. "
            +
            "Subcategories are used to further organize products within a category. Returns the created subcategory with its assigned unique identifier.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Subcategory created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input data or validation failed"),
            @ApiResponse(responseCode = "404", description = "Category not found with the provided ID"),
            @ApiResponse(responseCode = "500", description = "Internal server error during subcategory creation")
    })
    public ResponseEntity<SubCategoryAdminResponse> createSubcategory(
            @Parameter(description = "Subcategory registration request containing subcategory details", required = true) @Valid @RequestBody SubCategoryRegisterRequest request) {
        SubCategoryAdminResponse createdSubCategory = subCategoryService.createSubCategory(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdSubCategory);
    }

    @PutMapping("/subcategories/{id}")
    @Operation(summary = "Update existing subcategory (Admin)", description = "Update an existing subcategory's information. Allows partial updates - only provided fields will be updated. "
            +
            "Subcategory must exist in the system. Can update name, active status, and parent category.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Subcategory updated successfully"),
            @ApiResponse(responseCode = "404", description = "Subcategory not found with the provided ID"),
            @ApiResponse(responseCode = "400", description = "Invalid input data or validation failed"),
            @ApiResponse(responseCode = "500", description = "Internal server error during update")
    })
    public ResponseEntity<SubCategoryAdminResponse> updateSubcategory(
            @Parameter(description = "Unique identifier of the subcategory to update", example = "1", required = true) @PathVariable Long id,
            @Parameter(description = "Subcategory update request with fields to modify", required = true) @Valid @RequestBody SubCategoryUpdateRequest request) {
        SubCategoryAdminResponse updatedSubCategory = subCategoryService.updateSubCategory(id, request);
        return ResponseEntity.ok(updatedSubCategory);
    }

    @DeleteMapping("/subcategories/{id}")
    @Operation(summary = "Delete subcategory (Admin)", description = "Permanently delete a subcategory from the system by its unique identifier. "
            +
            "This operation cannot be undone. Ensure the subcategory has no associated products before deletion.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Subcategory deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Subcategory not found with the provided ID"),
            @ApiResponse(responseCode = "409", description = "Subcategory cannot be deleted (has associated products)"),
            @ApiResponse(responseCode = "500", description = "Internal server error during deletion")
    })
    public ResponseEntity<Void> deleteSubcategory(
            @Parameter(description = "Unique identifier of the subcategory to delete", example = "1", required = true) @PathVariable Long id) {
        subCategoryService.deleteSubCategory(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/blogs")
    @Operation(
            summary = "Get all blogs (Admin)",
            description = "Retrieve a paginated list of all blog posts with optional search and status filtering. " +
                    "Only accessible to ADMIN users. Supports pagination with configurable page size, search, and status filter. " +
                    "Returns a PagedResponse containing the blog list, total count, and pagination metadata."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved blogs list"),
            @ApiResponse(responseCode = "400", description = "Invalid pagination parameters"),
            @ApiResponse(responseCode = "401", description = "Unauthorized - ADMIN role required"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<PagedResponse<BlogDetailResponse>> getBlogs(
            @Parameter(description = "Page number (0-indexed)", example = "0")
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Number of items per page", example = "10")
            @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "Search query to filter blogs by title or content", example = "React")
            @RequestParam(defaultValue = "") String search,
            @Parameter(description = "Filter blogs by status (DRAFT, PUBLISHED, ARCHIVED)", example = "PUBLISHED")
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(blogService.findBlogsForAdmin(page, size, search, status));
    }

    @GetMapping("/blogs/{id}")
    @Operation(
            summary = "Get blog by ID (Admin)",
            description = "Retrieve detailed information about a specific blog by its unique identifier. " +
                    "Only accessible to ADMIN users. Returns complete blog details including content, comments, and status."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Blog found and returned successfully"),
            @ApiResponse(responseCode = "404", description = "Blog not found with the provided ID"),
            @ApiResponse(responseCode = "400", description = "Invalid blog ID format"),
            @ApiResponse(responseCode = "401", description = "Unauthorized - ADMIN role required")
    })
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<BlogDetailResponse> getBlogById(
            @Parameter(description = "Unique identifier of the blog", example = "1", required = true)
            @PathVariable Long id) {
        return ResponseEntity.ok(blogService.getBlogById(id));
    }

    @PostMapping("/blogs")
    @Operation(summary = "Create new blog post", description = "Create a new blog post with rich content. Only accessible to ADMIN users. "
            + "Automatically generates SEO-friendly slug from title and sets initial status to DRAFT.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Blog post created successfully with assigned ID"),
            @ApiResponse(responseCode = "400", description = "Invalid input data or validation failed"),
            @ApiResponse(responseCode = "409", description = "Blog title or slug already exists"),
            @ApiResponse(responseCode = "401", description = "Unauthorized - ADMIN role required")
    })
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<BlogDetailResponse> createBlog(
            @Parameter(description = "Blog creation request with title, content, thumbnail URL, and author ID", required = true) @Valid @RequestBody AddBlogRequest request) {
        BlogDetailResponse created = blogService.createBlog(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/blogs/{id}")
    @Operation(summary = "Update existing blog post", description = "Update an existing blog post. Only accessible to ADMIN users. "
            + "Supports partial updates - only provided fields will be modified. Validates slug uniqueness if changed.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Blog post updated successfully"),
            @ApiResponse(responseCode = "404", description = "Blog post not found with provided ID"),
            @ApiResponse(responseCode = "400", description = "Invalid input data or validation failed"),
            @ApiResponse(responseCode = "409", description = "New slug already exists for another blog"),
            @ApiResponse(responseCode = "401", description = "Unauthorized - ADMIN role required")
    })
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<BlogDetailResponse> updateBlog(
            @Parameter(description = "Unique identifier of the blog post to update", example = "1", required = true) @PathVariable Long id,
            @Parameter(description = "Blog update request with fields to modify (all fields optional)", required = true) @Valid @RequestBody UpdateBlogRequest request) {
        try {
            BlogDetailResponse updated = blogService.updateBlog(id, request);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/blogs/{id}/status")
    @Operation(summary = "Change blog status", description = "Change the status of a blog post (DRAFT, PUBLISHED, ARCHIVED). "
            + "Only accessible to ADMIN users. Validates workflow rules (e.g., cannot publish without featured image).")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Blog status updated successfully"),
            @ApiResponse(responseCode = "404", description = "Blog post not found with provided ID"),
            @ApiResponse(responseCode = "400", description = "Invalid status or validation failed"),
            @ApiResponse(responseCode = "401", description = "Unauthorized - ADMIN role required")
    })
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<BlogDetailResponse> updateBlogStatus(
            @Parameter(description = "Unique identifier of the blog post", example = "1", required = true) @PathVariable Long id,
            @Parameter(description = "New status for the blog (DRAFT, PUBLISHED, ARCHIVED)", required = true) @Valid @RequestBody BlogStatusUpdateRequest request) {
        try {
            BlogDetailResponse updated = blogService.updateBlogStatus(id, request.status());
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/blogs/{id}")
    @Operation(summary = "Delete blog post", description = "Permanently delete a blog post. Only accessible to ADMIN users. "
            + "This operation is irreversible.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Blog post deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Blog post not found with provided ID"),
            @ApiResponse(responseCode = "401", description = "Unauthorized - ADMIN role required")
    })
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<Void> deleteBlog(
            @Parameter(description = "Unique identifier of the blog post to delete", example = "1", required = true) @PathVariable Long id) {
        try {
            blogService.deleteBlog(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
