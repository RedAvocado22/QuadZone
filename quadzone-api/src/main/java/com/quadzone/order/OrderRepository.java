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
                        """)
        Page<Order> search(@Param("keyword") String keyword, Pageable pageable);
        
        /**
         * Find order by order number (format: ORD-00001)
         * Extracts the numeric ID from the order number
         */
        default Optional<Order> findByOrderNumber(String orderNumber) {
            try {
                // Remove "ORD-" prefix and parse the number
                if (orderNumber != null && orderNumber.startsWith("ORD-")) {
                    String idStr = orderNumber.substring(4).trim();
                    Long id = Long.parseLong(idStr);
                    return findById(id);
                }
                return Optional.empty();
            } catch (NumberFormatException e) {
                return Optional.empty();
            }
        }
}
