package com.quadzone.order.dto;

import java.time.LocalDateTime;

public record OrderTimelineEvent(
        String type,
        String title,
        String description,
        LocalDateTime timestamp
) {}
