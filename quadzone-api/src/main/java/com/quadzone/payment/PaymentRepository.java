package com.quadzone.payment;

import com.quadzone.order.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByOrder(Order order);

    @Query("SELECT YEAR(p.paymentDate), MONTH(p.paymentDate), SUM(o.totalAmount) FROM Payment p JOIN p.order o WHERE p.paymentStatus = :status AND p.paymentDate BETWEEN :from AND :to GROUP BY YEAR(p.paymentDate), MONTH(p.paymentDate) ORDER BY YEAR(p.paymentDate), MONTH(p.paymentDate)")
    java.util.List<Object[]> aggregateMonthlySales(@Param("status") PaymentStatus status, @Param("from") LocalDateTime from, @Param("to") LocalDateTime to);
}
