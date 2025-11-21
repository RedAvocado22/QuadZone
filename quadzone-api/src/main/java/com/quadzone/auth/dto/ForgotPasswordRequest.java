package com.quadzone.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;

public record ForgotPasswordRequest(
        @NotEmpty(message = "Email is required")
        @Email(message = "Email must be valid")
        String email
) {
}
