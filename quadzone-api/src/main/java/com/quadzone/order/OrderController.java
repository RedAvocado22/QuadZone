package com.quadzone.order;

import com.quadzone.global.dto.PagedResponse;
import com.quadzone.order.dto.AssignOrderToShipperRequest;
import com.quadzone.order.dto.CheckoutRequest;
import com.quadzone.order.dto.OrderDetailsResponse;
import com.quadzone.order.dto.OrderRegisterRequest;
import com.quadzone.order.dto.OrderResponse;
import com.quadzone.order.dto.OrderStatusResponse;
import com.quadzone.order.dto.OrderUpdateRequest;
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
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
@Tag(name = "Order API", description = "Order management API providing comprehensive order operations. " +
        "Includes admin endpoints for order management and public endpoints for customer order tracking. " +
        "Supports order creation, updates, retrieval, and status management.")
public class OrderController {

    private final OrderService orderService;

    @GetMapping("/admin")
    @Operation(
            summary = "Get all orders (Admin)",
            description = "Retrieve a paginated list of all orders in the system with optional search functionality for admin users. " +
                    "Supports pagination and search by order ID, customer name, or order status. " +
                    "Returns complete order information with customer and product details."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved orders list with pagination metadata"),
            @ApiResponse(responseCode = "400", description = "Invalid pagination parameters"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<PagedResponse<OrderResponse>> getOrders(
            @Parameter(description = "Page number (0-indexed)", example = "0")
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Number of items per page", example = "10")
            @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "Search query to filter orders by ID, customer name, or status", example = "pending")
            @RequestParam(defaultValue = "") String search
    ) {
        return ResponseEntity.ok(orderService.findOrders(page, size, search));
    }

    @GetMapping("/admin/{id}")
    @Operation(
            summary = "Get order by ID (Admin)",
            description = "Retrieve detailed information about a specific order by its unique identifier for admin users. " +
                    "Returns complete order details including customer information, order items, shipping details, and status."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Order found and returned successfully"),
            @ApiResponse(responseCode = "404", description = "Order not found with the provided ID"),
            @ApiResponse(responseCode = "400", description = "Invalid order ID format")
    })
    public ResponseEntity<OrderResponse> getOrderForAdmin(
            @Parameter(description = "Unique identifier of the order", example = "1", required = true)
            @PathVariable Long id) {
        return ResponseEntity.ok(orderService.findById(id));
    }

    @PostMapping("/admin")
    @Operation(
            summary = "Create order (Admin)",
            description = "Create a new order in the system for admin users. " +
                    "Requires order details including customer information, order items, shipping address, and payment information. " +
                    "Returns the created order with its assigned unique identifier."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Order created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input data, validation failed, or insufficient stock"),
            @ApiResponse(responseCode = "500", description = "Internal server error during order creation")
    })
    public ResponseEntity<OrderResponse> createOrder(
            @Parameter(description = "Order registration request containing order details", required = true)
            @Valid @RequestBody OrderRegisterRequest orderRegisterRequest) {
        OrderResponse createdOrder = orderService.createOrder(orderRegisterRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdOrder);
    }

    // Checkout endpoint (supports both guest and authenticated users)
    @PostMapping("/checkout")
    @Operation(summary = "Checkout", description = "Create a new order. Supports both guest and authenticated users.")
    @ApiResponse(responseCode = "201", description = "Order created successfully")
    @ApiResponse(responseCode = "400", description = "Invalid input or insufficient stock")
    public ResponseEntity<OrderResponse> checkout(@Valid @RequestBody CheckoutRequest request) {
        OrderResponse createdOrder = orderService.checkout(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdOrder);
    }

    // Public endpoint to check order status by order number
    @GetMapping("/public/track")
    @Operation(summary = "Track order status", description = "Check order status by order number (public endpoint)")
    @ApiResponse(responseCode = "200", description = "Order status returned")
    @ApiResponse(responseCode = "404", description = "Order not found")
    public ResponseEntity<OrderStatusResponse> trackOrder(
            @RequestParam String orderNumber
    ) {
        OrderStatusResponse statusResponse = orderService.getOrderStatusByOrderNumber(orderNumber);
        if (statusResponse.status() == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(statusResponse);
        }
        return ResponseEntity.ok(statusResponse);
    }

    // User-specific endpoint for viewing own orders
    @GetMapping("/my-orders")
    @Operation(
            summary = "Get my orders",
            description = "Retrieve a paginated list of orders for the currently authenticated user. " +
                    "Requires authentication. Returns orders sorted by date descending."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved user's orders"),
            @ApiResponse(responseCode = "401", description = "User not authenticated"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    public ResponseEntity<PagedResponse<OrderResponse>> getMyOrders(
            @Parameter(description = "Page number (0-indexed)", example = "0")
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Number of items per page", example = "10")
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(orderService.getMyOrders(page, size));
    }

    // User-specific endpoint for viewing own order details with items
    @GetMapping("/my-orders/{id}")
    @Operation(
            summary = "Get my order details",
            description = "Retrieve detailed information about a specific order for the currently authenticated user. " +
                    "Includes order items with product information. Requires authentication."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved order details"),
            @ApiResponse(responseCode = "401", description = "User not authenticated"),
            @ApiResponse(responseCode = "403", description = "Order does not belong to user"),
            @ApiResponse(responseCode = "404", description = "Order not found")
    })
    public ResponseEntity<OrderDetailsResponse> getMyOrderDetails(
            @Parameter(description = "Unique identifier of the order", example = "1", required = true)
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(orderService.getMyOrderDetails(id));
    }

    // Regular endpoints
    @GetMapping("/{id}")
    @Operation(
            summary = "Get order by ID",
            description = "Retrieve detailed information about a specific order by its unique identifier. " +
                    "Public endpoint that returns order information for the authenticated user or public order tracking."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Order found and returned successfully"),
            @ApiResponse(responseCode = "404", description = "Order not found with the provided ID"),
            @ApiResponse(responseCode = "400", description = "Invalid order ID format")
    })
    public ResponseEntity<OrderResponse> getOrder(
            @Parameter(description = "Unique identifier of the order", example = "1", required = true)
            @PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrder(id));
    }

    @PutMapping("/{id}")
    @Operation(
            summary = "Update order",
            description = "Update an existing order's information. Allows partial updates - only provided fields will be modified. " +
                    "Order must exist in the system. Can update order status, shipping information, and order items."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Order updated successfully"),
            @ApiResponse(responseCode = "404", description = "Order not found with the provided ID"),
            @ApiResponse(responseCode = "400", description = "Invalid input data, validation failed, or invalid status transition"),
            @ApiResponse(responseCode = "500", description = "Internal server error during update")
    })
    public ResponseEntity<OrderResponse> updateOrder(
            @Parameter(description = "Unique identifier of the order to update", example = "1", required = true)
            @PathVariable Long id,
            @Parameter(description = "Order update request with fields to modify", required = true)
            @Valid @RequestBody OrderUpdateRequest orderUpdateRequest) {
        try {
            OrderResponse updatedOrder = orderService.updateOrder(id, orderUpdateRequest);
            return ResponseEntity.ok(updatedOrder);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @Operation(
            summary = "Delete order",
            description = "Permanently delete an order from the system by its unique identifier. " +
                    "This operation is irreversible. Typically used for cancelled or invalid orders. " +
                    "Ensure the order can be safely deleted before proceeding."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Order deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Order not found with the provided ID"),
            @ApiResponse(responseCode = "409", description = "Order cannot be deleted (already shipped or processed)"),
            @ApiResponse(responseCode = "500", description = "Internal server error during deletion")
    })
    public ResponseEntity<Void> deleteOrder(
            @Parameter(description = "Unique identifier of the order to delete", example = "1", required = true)
            @PathVariable Long id) {
        try {
            orderService.deleteOrder(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/admin/{orderId}/assign-shipper")
    @Operation(
            summary = "Assign order to shipper (Staff)",
            description = "Assign an order to a shipper for delivery. This endpoint is available for Staff users. " +
                    "Creates or updates a delivery record with shipper information, tracking number, and delivery details. " +
                    "The assigned shipper will receive a notification about the assignment."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Order assigned to shipper successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input data, user is not a shipper, or invalid request"),
            @ApiResponse(responseCode = "404", description = "Order or shipper not found"),
            @ApiResponse(responseCode = "403", description = "Forbidden - only Staff can assign orders"),
            @ApiResponse(responseCode = "500", description = "Internal server error during assignment")
    })
    public ResponseEntity<OrderResponse> assignOrderToShipper(
            @Parameter(description = "Unique identifier of the order to assign", example = "1", required = true)
            @PathVariable Long orderId,
            @Parameter(description = "Request containing shipper ID and delivery details", required = true)
            @Valid @RequestBody AssignOrderToShipperRequest request) {
        OrderResponse assignedOrder = orderService.assignOrderToShipper(orderId, request);
        return ResponseEntity.ok(assignedOrder);
    }
}
