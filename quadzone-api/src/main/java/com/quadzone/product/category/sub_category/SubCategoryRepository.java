package com.quadzone.product.category.sub_category;

import com.quadzone.product.category.sub_category.dto.SubCategoryResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubCategoryRepository extends JpaRepository<SubCategory, Long> {

    List<SubCategory> findByCategory_Id(Long categoryId);
}
