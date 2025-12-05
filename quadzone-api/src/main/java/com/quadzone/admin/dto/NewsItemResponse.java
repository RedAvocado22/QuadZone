package com.quadzone.admin.dto;

import java.time.LocalDateTime;

public record NewsItemResponse(
        String type,
        String title,
        String description,
        LocalDateTime timestamp,
        String refType,
        Long refId
) {}
