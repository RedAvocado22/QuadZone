package com.quadzone.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

import java.time.LocalDate;

public record UserProfileRequest(
        @NotBlank(message = "First name is required")
        String firstName,

        @NotBlank(message = "Last name is required")
        String lastName,

        @Pattern(regexp = "^[0-9+\\-\\s()]*$", message = "Invalid phone number")
        String phoneNumber,

        String address,
        String city,
        LocalDate dateOfBirth
) {}
