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
import com.quadzone.product.category.sub_category.dto.SubCategoryAdminResponse;
import com.quadzone.product.category.sub_category.dto.SubCategoryRegisterRequest;
import com.quadzone.product.category.sub_category.dto.SubCategoryResponse;
import com.quadzone.product.category.sub_category.dto.SubCategoryUpdateRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final ObjectMapper objectMapper;

    public List<CategoryResponse> findAll() {
        return categoryRepository.findAll()
                .stream()
                .map(CategoryResponse::from)
                .toList();
    }

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

    // ------------- ADMIN METHODS---------------
    @Transactional(readOnly = true)
    public PagedResponse<CategoryAdminResponse> findCategories(int page, int size, String search) {
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

        return PagedResponse.of(
                categories,
                resultPage.getTotalElements(),
                resultPage.getNumber(),
                resultPage.getSize());
    }

    @Transactional(readOnly = true)
    public CategoryAdminResponse findById(Long id) {
        return categoryRepository.findById(id)
                .map(CategoryAdminResponse::from)
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

        return PagedResponse.of(
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

    public List<SubCategoryResponse> getSubCategoriesByCategoryId(Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + categoryId));

        List<SubCategory> subCategories = subCategoryRepository.findByCategory_Id(categoryId);

        return subCategories.stream()
                .map(SubCategoryResponse::from)
                .collect(Collectors.toList());
    }

    public SubCategoryResponse createSubCategory(Long categoryId, SubCategoryRegisterRequest req) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        SubCategory sub = new SubCategory();
        sub.setName(req.name());
        sub.setIsActive(req.active());
        sub.setCategory(category);

        subCategoryRepository.save(sub);
        return SubCategoryResponse.from(sub);
    }

    public SubCategoryResponse updateSubCategory(Long categoryId, Long subId, SubCategoryUpdateRequest req) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        SubCategory sub = subCategoryRepository.findById(subId)
                .orElseThrow(() -> new RuntimeException("SubCategory not found"));

        sub.setName(req.name());
        sub.setIsActive(req.active());
        sub.setCategory(category);

        subCategoryRepository.save(sub);
        return SubCategoryResponse.from(sub);
    }

    public void deleteSubCategory(Long categoryId, Long subId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        SubCategory sub = subCategoryRepository.findById(subId)
                .orElseThrow(() -> new RuntimeException("SubCategory not found"));

        if (!sub.getCategory().getId().equals(categoryId))
            throw new RuntimeException("SubCategory does not belong to this Category");

        subCategoryRepository.delete(sub);
    }

    // Admin methods for subcategories with SubCategoryAdminResponse
    @Transactional(readOnly = true)
    public PagedResponse<SubCategoryAdminResponse> findAllSubCategoriesForAdmin(int page, int size, String search) {
        Pageable pageable = PageRequest.of(Math.max(page, 0), Math.max(size, 1), Sort.by(Sort.Direction.ASC, "name"));

        Page<SubCategory> resultPage = subCategoryRepository.findAll(pageable);

        var subCategories = resultPage.stream()
                .map(SubCategoryAdminResponse::from)
                .toList();

        return PagedResponse.of(
                subCategories,
                resultPage.getTotalElements(),
                resultPage.getNumber(),
                resultPage.getSize());
    }

    @Transactional(readOnly = true)
    public SubCategoryAdminResponse findSubCategoryByIdForAdmin(Long id) {
        return subCategoryRepository.findById(id)
                .map(SubCategoryAdminResponse::from)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "SubCategory not found: " + id));
    }
}
