package com.quadzone.order;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {

        @Query("""
                        SELECT o
                        FROM Order o
                        WHERE LOWER(COALESCE(o.user.firstName, '') || ' ' || COALESCE(o.user.lastName, ''))
                                LIKE LOWER(CONCAT('%', :keyword, '%'))
                           OR LOWER(COALESCE(o.user.email, '')) LIKE LOWER(CONCAT('%', :keyword, '%'))
                           OR LOWER(COALESCE(o.orderNumber, '')) LIKE LOWER(CONCAT('%', :keyword, '%'))
                        """)
        Page<Order> search(@Param("keyword") String keyword, Pageable pageable);
        
        /**
         * Find order by order number
         */
        Optional<Order> findByOrderNumber(String orderNumber);

        /**
         * Check if order number exists
         */
        boolean existsByOrderNumber(String orderNumber);
}
