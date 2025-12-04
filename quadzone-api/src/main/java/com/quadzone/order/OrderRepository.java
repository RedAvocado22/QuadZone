package com.quadzone.order;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
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
         * Find orders by status
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

        /**
         * Find orders by user ID with pagination
         */
        @Query("SELECT o FROM Order o WHERE o.user.id = :userId ORDER BY o.orderDate DESC")
        Page<Order> findByUserId(@Param("userId") Long userId, Pageable pageable);

        /**
         * Find orders by user email (for guest users who register later)
         */
        @Query("SELECT o FROM Order o WHERE o.customerEmail = :email ORDER BY o.orderDate DESC")
        Page<Order> findByCustomerEmail(@Param("email") String email, Pageable pageable);

        /**
         * Find orders by user ID and order status
         */
        @Query("SELECT o FROM Order o WHERE o.user.id = :userId AND o.orderStatus = :status")
        List<Order> findByUserIdAndOrderStatus(@Param("userId") Long userId, @Param("status") OrderStatus status);
        Page<Order> findByOrderStatus(OrderStatus status, Pageable pageable);


        /**
         * Search orders with status filter
         */
        @Query("""
                        SELECT o
                        FROM Order o
                        WHERE o.orderStatus = :status
                          AND (LOWER(COALESCE(o.user.firstName, '') || ' ' || COALESCE(o.user.lastName, ''))
                                LIKE LOWER(CONCAT('%', :keyword, '%'))
                           OR LOWER(COALESCE(o.user.email, '')) LIKE LOWER(CONCAT('%', :keyword, '%'))
                           OR LOWER(COALESCE(o.orderNumber, '')) LIKE LOWER(CONCAT('%', :keyword, '%')))
                        """)
        Page<Order> searchByQueryAndStatus(@Param("keyword") String keyword, @Param("status") OrderStatus status, Pageable pageable);
        
        /**
         * Find order by order number
         */
        Optional<Order> findByOrderNumber(String orderNumber);

        /**
         * Check if order number exists
         */
        boolean existsByOrderNumber(String orderNumber);
}
