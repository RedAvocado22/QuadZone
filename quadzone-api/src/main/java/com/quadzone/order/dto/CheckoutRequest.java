package com.quadzone.order.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.util.List;

public record CheckoutRequest(
        // Customer information (required for guest, optional for logged-in users)
        @NotBlank(message = "First name is required")
        String firstName,

        @NotBlank(message = "Last name is required")
        String lastName,

        @NotBlank(message = "Email is required")
        @Email(message = "Email must be valid")
        String email,

        @NotBlank(message = "Phone is required")
        @Pattern(regexp = "^[+]?[(]?[0-9]{1,4}[)]?[-\\s.]?[(]?[0-9]{1,4}[)]?[-\\s.]?[0-9]{1,9}$", 
                 message = "Phone number must be valid")
        String phone,

        // Address information
        @NotBlank(message = "Address is required")
        String address,

        String city,

        String state,

        String apartment,

        // Order items
        @NotNull(message = "Order items are required")
        @NotEmpty(message = "At least one item is required")
        @Valid
        List<CheckoutItemRequest> items,

        // Order totals
        @NotNull(message = "Subtotal is required")
        @PositiveOrZero(message = "Subtotal must be positive or zero")
        Double subtotal,

        @PositiveOrZero(message = "Tax amount must be positive or zero")
        Double taxAmount,

        @NotNull(message = "Shipping cost is required")
        @PositiveOrZero(message = "Shipping cost must be positive or zero")
        Double shippingCost,

        @PositiveOrZero(message = "Discount amount must be positive or zero")
        Double discountAmount,

        @NotNull(message = "Total amount is required")
        @Positive(message = "Total amount must be positive")
        Double totalAmount,

        // Payment method
        @NotBlank(message = "Payment method is required")
        String paymentMethod,

        // Optional fields
        String notes
) {
    public record CheckoutItemRequest(
            @NotNull(message = "Product ID is required")
            Long productId,

            @NotNull(message = "Quantity is required")
            @Min(value = 1, message = "Quantity must be at least 1")
            Integer quantity
    ) {}
}

