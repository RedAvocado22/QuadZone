package com.quadzone.vnpayment.dto;

import jakarta.validation.constraints.NotBlank;

public record VnPaymentResponse(
        @NotBlank(message = "Transaction reference is required")
        String vnp_TxnRef,

        @NotBlank(message = "Amount is required")
        String vnp_Amount,

        @NotBlank(message = "Response code is required")
        String vnp_ResponseCode,

        String vnp_TransactionStatus,

        @NotBlank(message = "Secure hash is required")
        String vnp_SecureHash,

        String vnp_OrderInfo,

        String vnp_TransactionNo,

        String vnp_BankCode,

        String vnp_PayDate,

        String message
) {}
