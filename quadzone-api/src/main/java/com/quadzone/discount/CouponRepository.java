package com.quadzone.discount;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface CouponRepository extends JpaRepository<Coupon, Long> {

    Optional<Coupon> findByCodeAndIsActiveTrue(String code);

    @Modifying
    @Query("UPDATE Coupon c SET c.usageCount = c.usageCount + 1 " +
            "WHERE c.id = :id AND (c.maxUsage IS NULL OR c.usageCount < c.maxUsage)")
    int incrementUsageCount(@Param("id") Long id);
}