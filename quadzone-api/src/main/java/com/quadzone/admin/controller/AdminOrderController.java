package com.quadzone.admin.controller;

import com.quadzone.admin.dto.AdminOrderResponse;
import com.quadzone.admin.dto.PagedResponse;
import com.quadzone.admin.service.AdminOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/orders")
@RequiredArgsConstructor
public class AdminOrderController {

    private final AdminOrderService adminOrderService;

    @GetMapping
    public ResponseEntity<PagedResponse<AdminOrderResponse>> getOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "") String search
    ) {
        return ResponseEntity.ok(adminOrderService.findOrders(page, size, search));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AdminOrderResponse> getOrder(@PathVariable Long id) {
        return ResponseEntity.ok(adminOrderService.findById(id));
    }
}

