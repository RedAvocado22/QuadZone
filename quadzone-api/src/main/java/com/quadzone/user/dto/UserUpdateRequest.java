package com.quadzone.user.dto;

import com.quadzone.user.UserRole;

public record UserUpdateRequest(
        String firstName,
        String lastName,
        String email,
        String password,
        UserRole role
) {
}

