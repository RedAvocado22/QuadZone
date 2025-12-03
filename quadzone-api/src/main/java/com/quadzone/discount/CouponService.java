package com.quadzone.discount;

import com.quadzone.discount.dto.CouponCreateRequest;
import com.quadzone.discount.dto.CouponValidationRequest;
import com.quadzone.discount.dto.CouponValidationResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class CouponService {

    private final CouponRepository couponRepository;

    public Coupon createCoupon(CouponCreateRequest request) {
        Coupon coupon = new Coupon();
        coupon.setCode(request.code());
        coupon.setDiscountType(request.discountType());
        coupon.setCouponValue(request.couponValue() != null ? request.couponValue() : 0.0);
        coupon.setMaxDiscountAmount(request.maxDiscountAmount() != null ? request.maxDiscountAmount() : 0.0);
        coupon.setMinOrderAmount(request.minOrderAmount() != null ? request.minOrderAmount() : 0.0);
        coupon.setMaxUsage(request.maxUsage() != null ? request.maxUsage() : 0);
        coupon.setUsageCount(0);
        coupon.setStartDate(request.startDate() != null ? request.startDate() : LocalDateTime.now());
        coupon.setEndDate(request.endDate());
        coupon.setActive(request.active() != null ? request.active() : true);

        return couponRepository.save(coupon);
    }

    // Dùng cho API /validate: không ném lỗi ra ngoài, mà trả về object để FE hiển thị
    public CouponValidationResponse validateCoupon(CouponValidationRequest request) {
        String code = request.code();
        Double subtotal = request.subtotal();

        if (code == null || code.isBlank()) {
            return new CouponValidationResponse(false, "Coupon code is required", null, 0, subtotal != null ? subtotal : 0);
        }
        if (subtotal == null || subtotal < 0) {
            return new CouponValidationResponse(false, "Invalid subtotal", code, 0, 0);
        }

        Coupon coupon = couponRepository.findByCodeAndIsActiveTrue(code)
                .orElse(null);
        if (coupon == null) {
            return new CouponValidationResponse(false, "Coupon not found or inactive", code, 0, subtotal);
        }

        try {
            // Tái sử dụng logic validate chung
            validateCouponAttributes(coupon, subtotal);
        } catch (RuntimeException ex) {
            return new CouponValidationResponse(false, ex.getMessage(), code, 0, subtotal);
        }

        double discount = calculateDiscount(code, subtotal);
        double finalTotal = Math.max(0, subtotal - discount);

        return new CouponValidationResponse(true, "Coupon applied successfully", code, discount, finalTotal);
    }

    public double calculateDiscount(String code, double totalOrderValue) {
        Coupon coupon = couponRepository.findByCodeAndIsActiveTrue(code)
                .orElseThrow(() -> new RuntimeException("Coupon not found"));

        // 1. Validate cơ bản
        validateCouponAttributes(coupon, totalOrderValue);

        // 2. Tính toán tiền giảm
        double discount = 0;

        if (coupon.getDiscountType() == DiscountType.FIXED_AMOUNT) {
            discount = coupon.getCouponValue();
        } else {
            // Tính %: total * (value / 100)
            discount = totalOrderValue * (coupon.getCouponValue() / 100);

            // Nếu có giảm tối đa, so sánh và lấy số nhỏ hơn
            if (coupon.getMaxDiscountAmount() != 0) {
                discount = Math.min(discount, coupon.getMaxDiscountAmount());
            }
        }

        return discount;
    }

    // Hàm 2: Áp dụng mã (Dùng khi Place Order/Checkout)
    @Transactional
    public void useCoupon(String code) {
        Coupon coupon = couponRepository.findByCodeAndIsActiveTrue(code)
                .orElseThrow(() -> new RuntimeException("Coupon not found"));

        // Thử update số lượng trong DB (Atomic check)
        int rowsAffected = couponRepository.incrementUsageCount(coupon.getId());

        if (rowsAffected == 0) {
            throw new RuntimeException("Coupon usage limit reached");
        }
    }

    // Helper: Validate logic chung
    private void validateCouponAttributes(Coupon coupon, double totalOrderValue) {
        LocalDateTime now = LocalDateTime.now();

        if (!coupon.isActive()) {
            throw new RuntimeException("Coupon is inactive");
        }
        if (now.isBefore(coupon.getStartDate()) || now.isAfter(coupon.getEndDate())) {
            throw new RuntimeException("Coupon not started or expired");
        }
        if (coupon.getUsageCount() >= coupon.getMaxUsage()) {
            throw new RuntimeException("Coupon usage limit reached");
        }
        if (totalOrderValue < coupon.getMinOrderAmount()) {
            throw new RuntimeException("Order value is less than the minimum order amount: " + coupon.getMinOrderAmount());
        }
    }
}
