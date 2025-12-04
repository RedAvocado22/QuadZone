package com.quadzone.user.dto;

import com.quadzone.user.User;
import com.quadzone.user.UserRole;
import com.quadzone.user.UserStatus;

public record UserAdminResponse(
        long id,
        String firstName,
        String lastName,
        String email,
        String password,
        UserRole role,
        UserStatus status,
        String avatarUrl,
        Boolean isVerified
) {
    public static UserAdminResponse from(final User user) {
        return new UserAdminResponse(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getPassword(),
                user.getRole(),
                user.getStatus(),
                user.getAvatarUrl(),
                user.getStatus() == UserStatus.ACTIVE
        );
    }
}
