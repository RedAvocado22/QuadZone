package com.quadzone.product;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {

        @Query("""
                        SELECT p
                        FROM Product p
                        WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
                           OR LOWER(COALESCE(p.brand, '')) LIKE LOWER(CONCAT('%', :keyword, '%'))
                        """)
        Page<Product> search(@Param("keyword") String keyword, Pageable pageable);

        Page<Product> findByNameContainingIgnoreCase(String query, Pageable pageable);

        @Query("""
                        SELECT p
                        FROM Product p LEFT JOIN p.reviews r
                        WHERE p.isActive = true AND p.stock > 0
                        GROUP BY p.id
                        ORDER BY COALESCE(AVG(r.rating), 0) DESC, COUNT(r.id) DESC
                        """)
        Page<Product> findFeaturedProducts(Pageable pageable);

        @Query("""
                        SELECT p
                        FROM Product p LEFT JOIN p.orderItems oi
                        WHERE p.isActive = true AND p.stock > 0
                        GROUP BY p.id
                        ORDER BY COALESCE(SUM(oi.quantity), 0) DESC
                        """)
        Page<Product> findBestSellingProducts(Pageable pageable);

        @Query("""
                        SELECT p
                        FROM Product p
                        WHERE p.isActive = true AND p.stock > 0
                        ORDER BY p.createdAt DESC
                        """)
        Page<Product> findNewArrivalProducts(Pageable pageable);

        @Query("SELECT DISTINCT p.brand FROM Product p WHERE p.brand IS NOT NULL ORDER BY p.brand")
        List<String> findAllBrands();

        @Query("""
                        SELECT p FROM Product p
                        WHERE (:brand IS NULL OR LOWER(p.brand) = LOWER(:brand))
                        AND (:categoryId IS NULL OR p.subCategory.category.id = :categoryId)
                        AND (:subcategoryId IS NULL OR p.subCategory.id = :subcategoryId)
                        AND p.isActive = true AND p.stock > 0
                        """)
        Page<Product> searchProducts(String brand, Long categoryId, Long subcategoryId, Pageable pageable);

        // Page<Product> findAll(Specification<Product> spec, Pageable pageable);
}
