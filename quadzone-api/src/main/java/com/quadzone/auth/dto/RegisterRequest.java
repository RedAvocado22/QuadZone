package com.quadzone.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;

public record RegisterRequest(
        @NotNull
        String firstname,

        @NotNull
        String lastname,

        @Email
        String email,

        @NotNull
        String password,

        @NotNull
        String confirm_password
) {
}
