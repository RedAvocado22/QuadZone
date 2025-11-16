package com.quadzone.order;

import com.quadzone.global.dto.PagedResponse;
import com.quadzone.order.dto.OrderRegisterRequest;
import com.quadzone.order.dto.OrderResponse;
import com.quadzone.order.dto.OrderUpdateRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
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
@Tag(name = "Order API", description = "API for managing orders")
public class OrderController {

    private final OrderService orderService;

    // Admin endpoints
    @GetMapping("/admin")
    @Operation(summary = "Get all orders (Admin)", description = "Get all orders with pagination and search")
    @ApiResponse(responseCode = "200", description = "Orders returned")
    public ResponseEntity<PagedResponse<OrderResponse>> getOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "") String search
    ) {
        return ResponseEntity.ok(orderService.findOrders(page, size, search));
    }

    @GetMapping("/admin/{id}")
    @Operation(summary = "Get order by ID (Admin)", description = "Get an order by ID for admin")
    @ApiResponse(responseCode = "200", description = "Order returned")
    @ApiResponse(responseCode = "404", description = "Order not found")
    public ResponseEntity<OrderResponse> getOrderForAdmin(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.findById(id));
    }

    @PostMapping("/admin")
    @Operation(summary = "Create order (Admin)", description = "Create a new order for admin")
    @ApiResponse(responseCode = "201", description = "Order created")
    @ApiResponse(responseCode = "400", description = "Invalid input")
    public ResponseEntity<OrderResponse> createOrder(@Valid @RequestBody OrderRegisterRequest orderRegisterRequest) {
        OrderResponse createdOrder = orderService.createOrder(orderRegisterRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdOrder);
    }

    // Regular endpoints
    @GetMapping("/{id}")
    @Operation(summary = "Get order by ID", description = "Get an order by ID")
    @ApiResponse(responseCode = "200", description = "Order returned")
    @ApiResponse(responseCode = "404", description = "Order not found")
    public ResponseEntity<OrderResponse> getOrder(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrder(id));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update order", description = "Update an existing order")
    @ApiResponse(responseCode = "200", description = "Order updated")
    @ApiResponse(responseCode = "404", description = "Order not found")
    @ApiResponse(responseCode = "400", description = "Invalid input")
    public ResponseEntity<OrderResponse> updateOrder(@PathVariable Long id, @Valid @RequestBody OrderUpdateRequest orderUpdateRequest) {
        try {
            OrderResponse updatedOrder = orderService.updateOrder(id, orderUpdateRequest);
            return ResponseEntity.ok(updatedOrder);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete order", description = "Delete an order by ID")
    @ApiResponse(responseCode = "204", description = "Order deleted")
    @ApiResponse(responseCode = "404", description = "Order not found")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        try {
            orderService.deleteOrder(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}

