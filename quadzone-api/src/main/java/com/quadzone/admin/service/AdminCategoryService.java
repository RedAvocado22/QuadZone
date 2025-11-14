package com.quadzone.admin.service;

import com.quadzone.admin.dto.AdminCategoryResponse;
import com.quadzone.admin.dto.PagedResponse;
import com.quadzone.product.category.Category;
import com.quadzone.product.category.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminCategoryService {

    private final CategoryRepository categoryRepository;

    public PagedResponse<AdminCategoryResponse> findCategories(int page, int size, String search) {
        Pageable pageable = PageRequest.of(Math.max(page, 0), Math.max(size, 1), Sort.by(Sort.Direction.ASC, "name"));

        Page<Category> resultPage;
        if (search != null && !search.isBlank()) {
            resultPage = categoryRepository.search(search.trim(), pageable);
        } else {
            resultPage = categoryRepository.findAll(pageable);
        }

        var categories = resultPage.stream()
                .map(this::toResponse)
                .toList();

        return new PagedResponse<>(
                categories,
                resultPage.getTotalElements(),
                resultPage.getNumber(),
                resultPage.getSize()
        );
    }

    public AdminCategoryResponse findById(Long id) {
        return categoryRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found: " + id));
    }

    private AdminCategoryResponse toResponse(Category category) {
        long productCount = category.getSubcategories() != null ? category.getSubcategories().size() : 0;
        return new AdminCategoryResponse(
                category.getId(),
                category.getName(),
                category.isActive(),
                productCount,
                category.getImageUrl()
        );
    }
}

