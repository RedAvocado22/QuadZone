package com.quadzone.notification.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record NotificationRequest(
        @NotBlank(message = "Type cannot be blank")
        @Size(max = 50, message = "Type cannot exceed 50 characters")
        String type,

        @NotBlank(message = "Title cannot be blank")
        @Size(max = 255, message = "Title cannot exceed 255 characters")
        String title,

        String description,
        String avatarUrl
) {
}

