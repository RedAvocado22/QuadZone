package com.quadzone.product.category.sub_category;

import org.springframework.stereotype.Service;

import com.quadzone.product.category.Category;
import com.quadzone.product.category.CategoryRepository;
import com.quadzone.product.category.sub_category.dto.SubCategoryAdminResponse;
import com.quadzone.product.category.sub_category.dto.SubCategoryRegisterRequest;
import com.quadzone.product.category.sub_category.dto.SubCategoryUpdateRequest;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
@Transactional
public class SubCategoryService {

    private final SubCategoryRepository subCategoryRepository;
    private final CategoryRepository categoryRepository;

    /**
     * Create a new sub-category
     * @param request SubCategoryRegisterRequest containing name, categoryId, and active status
     * @return SubCategoryAdminResponse with the created sub-category details
     * @throws ResponseStatusException if category is not found
     */
    @Transactional
    public SubCategoryAdminResponse createSubCategory(SubCategoryRegisterRequest request) {
        Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, 
                        "Category not found with id: " + request.categoryId()));

        SubCategory subCategory = SubCategory.builder()
                .name(request.name())
                .isActive(request.active() != null && request.active())
                .description("")
                .category(category)
                .build();

        SubCategory saved = subCategoryRepository.save(subCategory);
        return SubCategoryAdminResponse.from(saved);
    }

    /**
     * Add/register a sub-category (alias for createSubCategory)
     * @param request SubCategoryRegisterRequest containing sub-category details
     * @return SubCategoryAdminResponse with the created sub-category details
     */
    @Transactional
    public SubCategoryAdminResponse addSubCategoryMethod(SubCategoryRegisterRequest request) {
        return createSubCategory(request);
    }

    /**
     * Update an existing sub-category
     * @param id The sub-category ID to update
     * @param request SubCategoryUpdateRequest with fields to update
     * @return SubCategoryAdminResponse with updated details
     * @throws ResponseStatusException if sub-category is not found
     */
    @Transactional
    public SubCategoryAdminResponse updateSubCategory(Long id, SubCategoryUpdateRequest request) {
        SubCategory subCategory = subCategoryRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, 
                        "SubCategory not found with id: " + id));

        if (request.name() != null) {
            subCategory.setName(request.name());
        }
        if (request.active() != null) {
            subCategory.setIsActive(request.active());
        }
        if (request.categoryId() != null) {
            Category category = categoryRepository.findById(request.categoryId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, 
                            "Category not found with id: " + request.categoryId()));
            subCategory.setCategory(category);
        }

        SubCategory updated = subCategoryRepository.save(subCategory);
        return SubCategoryAdminResponse.from(updated);
    }

    /**
     * Delete a sub-category by ID
     * @param id The sub-category ID to delete
     * @throws ResponseStatusException if sub-category is not found
     */
    @Transactional
    public void deleteSubCategory(Long id) {
        if (!subCategoryRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, 
                    "SubCategory not found with id: " + id);
        }
        subCategoryRepository.deleteById(id);
    }

    /**
     * Get a sub-category by ID
     * @param id The sub-category ID
     * @return SubCategoryAdminResponse with sub-category details
     * @throws ResponseStatusException if sub-category is not found
     */
    public SubCategoryAdminResponse getSubCategoryById(Long id) {
        SubCategory subCategory = subCategoryRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, 
                        "SubCategory not found with id: " + id));
        return SubCategoryAdminResponse.from(subCategory);
    }
}
