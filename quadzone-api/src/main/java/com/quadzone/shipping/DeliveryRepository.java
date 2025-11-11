package com.quadzone.shipping;

import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.awt.print.Pageable;

@Repository
public interface DeliveryRepository extends JpaRepository<Delivery, Long> {
    
    Page<Delivery> findAllByStaffId(Long staffId, Pageable pageable);

}
