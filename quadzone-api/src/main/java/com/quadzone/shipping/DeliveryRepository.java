package com.quadzone.shipping;

import java.util.Optional;

import com.quadzone.order.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DeliveryRepository extends JpaRepository<Delivery, Long> {

    Page<Delivery> findAllByUser_Id(Long userId, Pageable pageable);
    
    Optional<Delivery> findByOrder(Order order);
}
