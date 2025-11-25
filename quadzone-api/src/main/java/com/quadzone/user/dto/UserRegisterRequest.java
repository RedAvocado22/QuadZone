package com.quadzone.user.dto;

import com.quadzone.user.User;
import com.quadzone.user.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UserRegisterRequest(
        @NotBlank(message = "First name cannot be blank")
        @Size(min = 1, max = 100, message = "First name must be between 1 and 100 characters")
        String firstName,

        @NotBlank(message = "Last name cannot be blank")
        @Size(min = 1, max = 100, message = "Last name must be between 1 and 100 characters")
        String lastName,

        @NotBlank(message = "Email cannot be blank")
        @Email(message = "Email must be valid")
        String email,

        @NotBlank(message = "Password cannot be blank")
        @Size(min = 6, message = "Password must be at least 6 characters")
        String password,

        @NotNull(message = "Role is required")
        UserRole role
) {
    public static User toUser(UserRegisterRequest request) {
        return User.builder()
                .firstName(request.firstName())
                .lastName(request.lastName())
                .email(request.email())
                .password(request.password())
                .role(request.role())
                .build();
    }
}

