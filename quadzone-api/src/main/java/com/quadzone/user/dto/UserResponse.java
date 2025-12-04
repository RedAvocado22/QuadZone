package com.quadzone.user.dto;

import com.quadzone.user.User;
import com.quadzone.user.UserRole;
import com.quadzone.user.UserStatus;

import java.time.LocalDateTime;

public record UserResponse(
        Long id,
        String firstName,
        String lastName,
        String email,
        UserRole role,
        LocalDateTime createdAt,
        UserStatus status,
        String avatarUrl,
        Boolean isVerified
) {
    public static UserResponse from(User user) {
        return new UserResponse(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getRole(),
                user.getCreatedAt(),
                user.getStatus(),
                user.getAvatarUrl(),
                user.getStatus() == UserStatus.ACTIVE
        );
    }
}

