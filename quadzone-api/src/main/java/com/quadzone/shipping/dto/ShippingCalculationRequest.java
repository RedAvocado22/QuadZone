package com.quadzone.shipping.dto;

import jakarta.validation.constraints.NotBlank;

public record ShippingCalculationRequest(
        @NotBlank(message = "Address is required")
        String address,      // Street Address
        
        String apartment,    // Village
        
        String block,        // Block
        
        String district,     // Town
        
        String city, // City

        String country 
) {
}

