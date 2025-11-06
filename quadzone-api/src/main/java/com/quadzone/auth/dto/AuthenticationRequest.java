package com.quadzone.auth.dto;

import jakarta.validation.constraints.NotNull;
import org.springframework.validation.annotation.Validated;

public record AuthenticationRequest(
        @NotNull
        String email,

        @NotNull
        @Validated
        String password
) {
}
