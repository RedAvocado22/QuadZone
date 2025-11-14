package com.quadzone.admin.controller;

import com.quadzone.admin.dto.AdminCategoryResponse;
import com.quadzone.admin.dto.PagedResponse;
import com.quadzone.admin.service.AdminCategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/categories")
@RequiredArgsConstructor
public class AdminCategoryController {

    private final AdminCategoryService adminCategoryService;

    @GetMapping
    public ResponseEntity<PagedResponse<AdminCategoryResponse>> getCategories(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "") String search
    ) {
        return ResponseEntity.ok(adminCategoryService.findCategories(page, size, search));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AdminCategoryResponse> getCategory(@PathVariable Long id) {
        return ResponseEntity.ok(adminCategoryService.findById(id));
    }
}

