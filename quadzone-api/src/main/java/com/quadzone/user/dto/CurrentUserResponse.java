package com.quadzone.user.dto;

import com.quadzone.user.User;
import com.quadzone.user.UserRole;

import java.time.LocalDateTime;

public record CurrentUserResponse(
        Long id,
        String firstName,
        String lastName,
        String email,
        UserRole role,
        LocalDateTime createdAt
) {
    public static CurrentUserResponse from(final User user) {
        return new CurrentUserResponse(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getRole(),
                user.getCreatedAt()
        );
    }
}
