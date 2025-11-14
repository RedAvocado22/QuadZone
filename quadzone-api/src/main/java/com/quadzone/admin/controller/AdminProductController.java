package com.quadzone.admin.controller;

import com.quadzone.admin.dto.AdminProductResponse;
import com.quadzone.admin.dto.PagedResponse;
import com.quadzone.admin.service.AdminProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/products")
@RequiredArgsConstructor
public class AdminProductController {

    private final AdminProductService adminProductService;

    @GetMapping
    public ResponseEntity<PagedResponse<AdminProductResponse>> getProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "") String search
    ) {
        return ResponseEntity.ok(adminProductService.findProducts(page, size, search));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AdminProductResponse> getProduct(@PathVariable Long id) {
        return ResponseEntity.ok(adminProductService.findById(id));
    }
}

