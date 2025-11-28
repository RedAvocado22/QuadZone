package com.quadzone.vnpayment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import org.hibernate.validator.constraints.URL;


public record VnPaymentRequest(
        @NotBlank(message = "Order ID is required")
        String orderId,

        @NotNull(message = "Amount is required")
        @Positive(message = "Amount must be positive")
        Long amount,

        @NotBlank(message = "Order info is required")
        String orderInfo,

        @NotBlank(message = "Return URL is required")
        @URL(message = "Return URL must be a valid URL")
        String returnUrl
) {}
