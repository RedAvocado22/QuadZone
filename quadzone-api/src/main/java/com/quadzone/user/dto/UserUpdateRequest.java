package com.quadzone.user.dto;

import com.quadzone.user.UserRole;
import com.quadzone.user.UserStatus;

public record UserUpdateRequest(
        String firstName,
        String lastName,
        String email,
        String password,
        UserRole role,
        UserStatus status,
        String avatarUrl,
        Boolean isVerified
) {
}

