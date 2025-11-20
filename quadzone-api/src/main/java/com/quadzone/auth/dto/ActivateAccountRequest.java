package com.quadzone.auth.dto;

import jakarta.validation.constraints.NotEmpty;

public record ActivateAccountRequest(@NotEmpty String token) {
}
