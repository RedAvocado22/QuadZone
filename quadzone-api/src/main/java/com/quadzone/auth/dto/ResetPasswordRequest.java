package com.quadzone.auth.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

public record ResetPasswordRequest(
        @NotEmpty(message = "Token is required")
        String token,
        @NotEmpty(message = "Password is required")
        @Size(min = 6, message = "Password must be at least 6 characters")
        String password,
        @NotEmpty(message = "Confirm password is required")
        String confirmPassword
) {
}
