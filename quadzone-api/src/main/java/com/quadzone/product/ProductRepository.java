package com.quadzone.product;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
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
                        FROM Product p
                        WHERE p.isActive = true AND p.stock > 0
                        ORDER BY p.createdAt DESC
                        """)
        Page<Product> findNewArrivalProducts(Pageable pageable);

        @Modifying // Báo cho Spring đây là câu lệnh Update/Delete
        @Query("UPDATE Product p SET p.stock = p.stock - :amount " +
                        "WHERE p.id = :id AND p.stock >= :amount")
        int reduceStock(@Param("id") Long id, @Param("amount") int amount);

        @Query("""
                        SELECT p
                        FROM Product p LEFT JOIN p.orderItems oi
                        WHERE p.isActive = true AND p.stock > 0
                        GROUP BY p.id
                        ORDER BY COALESCE(SUM(oi.quantity), 0) DESC
                        """)
        Page<Product> findBestSellingProducts(Pageable pageable);

        /**
         * Find all distinct brands
         */
        @Query("SELECT DISTINCT p.brand FROM Product p WHERE p.brand IS NOT NULL AND p.isActive = true ORDER BY p.brand")
        List<String> findAllDistinctBrands();

        /**
         * Find active products by subcategory
         */
        Page<Product> findBySubCategoryIdAndIsActiveTrue(Long subcategoryId, Pageable pageable);

        /**
         * Find active products by category (through subCategory)
         */
        @Query("SELECT p FROM Product p WHERE p.subCategory.category.id = :categoryId AND p.isActive = true")
        Page<Product> findByCategoryId(@Param("categoryId") Long categoryId, Pageable pageable);

        /**
         * Find product by ID with subcategory and category loaded
         */
        @Query("SELECT p FROM Product p " +
                        "LEFT JOIN FETCH p.subCategory sc " +
                        "LEFT JOIN FETCH sc.category " +
                        "WHERE p.id = :id")
        Optional<Product> findByIdWithCategory(@Param("id") Long id);
}
