package com.quadzone.product.category;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.quadzone.exception.category.CategoryNotFoundException;
import com.quadzone.global.dto.PagedResponse;
import com.quadzone.admin.dto.CategoryAdminResponse;
import com.quadzone.product.category.dto.CategoryRegisterRequest;
import com.quadzone.product.category.dto.CategoryResponse;
import com.quadzone.product.category.dto.CategoryUpdateRequest;
import com.quadzone.product.category.sub_category.SubCategory;
import com.quadzone.product.category.sub_category.SubCategoryRepository;
import com.quadzone.product.category.sub_category.dto.SubCategoryResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.ErrorResponseException;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final ObjectMapper objectMapper;

    public CategoryResponse getCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new CategoryNotFoundException(id));
        return CategoryResponse.from(category);
    }

    public CategoryResponse createCategory(CategoryRegisterRequest request) {
        Category category = CategoryRegisterRequest.toCategory(request);
        return CategoryResponse.from(categoryRepository.save(category));
    }

    public CategoryResponse updateCategory(Long id, CategoryUpdateRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new CategoryNotFoundException(id));

        category.updateFrom(request);

        return CategoryResponse.from(categoryRepository.save(category));
    }

    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new CategoryNotFoundException(id);
        }
        categoryRepository.deleteById(id);
    }

    // Admin methods
    @Transactional(readOnly = true)
    public PagedResponse<CategoryResponse> findCategories(int page, int size, String search) {
        Pageable pageable = PageRequest.of(Math.max(page, 0), Math.max(size, 1), Sort.by(Sort.Direction.ASC, "name"));

        Page<Category> resultPage;
        if (search != null && !search.isBlank()) {
            resultPage = categoryRepository.search(search.trim(), pageable);
        } else {
            resultPage = categoryRepository.findAll(pageable);
        }

        var categories = resultPage.stream()
                .map(CategoryResponse::from)
                .toList();

        return new PagedResponse<>(
                categories,
                resultPage.getTotalElements(),
                resultPage.getNumber(),
                resultPage.getSize()
        );
    }

    @Transactional(readOnly = true)
    public CategoryResponse findById(Long id) {
        return categoryRepository.findById(id)
                .map(CategoryResponse::from)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found: " + id));
    }

    public List<CategoryResponse> findAll() {
        return categoryRepository.findAll()
                .stream()
                .map(CategoryResponse::from)
                .toList();
    }

    // Admin methods with admin DTOs
    @Transactional(readOnly = true)
    public PagedResponse<CategoryAdminResponse> findCategoriesForAdmin(int page, int size, String search) {
        Pageable pageable = PageRequest.of(Math.max(page, 0), Math.max(size, 1), Sort.by(Sort.Direction.ASC, "name"));

        Page<Category> resultPage;
        if (search != null && !search.isBlank()) {
            resultPage = categoryRepository.search(search.trim(), pageable);
        } else {
            resultPage = categoryRepository.findAll(pageable);
        }

        var categories = resultPage.stream()
                .map(CategoryAdminResponse::from)
                .toList();

        return new PagedResponse<>(
                categories,
                resultPage.getTotalElements(),
                resultPage.getNumber(),
                resultPage.getSize()
        );
    }

    @Transactional(readOnly = true)
    public CategoryAdminResponse findByIdForAdmin(Long id) {
        return categoryRepository.findById(id)
                .map(CategoryAdminResponse::from)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found: " + id));
    }

    public CategoryAdminResponse createCategoryForAdmin(CategoryRegisterRequest request) {
        Category category = CategoryRegisterRequest.toCategory(request);
        return CategoryAdminResponse.from(categoryRepository.save(category));
    }

    public CategoryAdminResponse updateCategoryForAdmin(Long id, CategoryUpdateRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new CategoryNotFoundException(id));

        category.updateFrom(request);

        return CategoryAdminResponse.from(categoryRepository.save(category));
    }
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll()
                .stream()
                .map(CategoryResponse::from)
                .toList();
    }


    @Autowired
    private SubCategoryRepository subCategoryRepository;

    // ✅ This should NOT be static
    public List<SubCategoryResponse> getSubCategoriesByCategoryId(Long categoryId) {
        // Verify category exists
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + categoryId));

        // Fetch subcategories - call as instance method
        List<SubCategory> subCategories = subCategoryRepository.findByCategory_Id(categoryId);

        // Map to response DTOs using the static from() method
        return subCategories.stream()
                .map(SubCategoryResponse::from)
                .collect(Collectors.toList());
    }
}
