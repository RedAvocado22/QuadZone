package com.quadzone.admin.dto;

import java.time.LocalDateTime;

public record AdminUserResponse(
        Long id,
        String name,
        String email,
        String role,
        LocalDateTime createdAt
) {
}

