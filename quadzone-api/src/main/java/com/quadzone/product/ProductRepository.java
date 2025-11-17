package com.quadzone.product;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductRepository extends JpaRepository<Product, Long> {

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
}
