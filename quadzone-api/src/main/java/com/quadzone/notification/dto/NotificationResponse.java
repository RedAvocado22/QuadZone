package com.quadzone.notification.dto;

import com.quadzone.notification.Notification;

import java.time.LocalDateTime;

public record NotificationResponse(
        Long id,
        String type,
        String title,
        String description,
        String avatarUrl,
        LocalDateTime postedAt,
        boolean isUnRead
) {
    public static NotificationResponse from(Notification notification) {
        return new NotificationResponse(
                notification.getId(),
                notification.getType(),
                notification.getTitle(),
                notification.getDescription(),
                notification.getAvatarUrl(),
                notification.getPostedAt(),
                notification.isUnRead()
        );
    }
}

