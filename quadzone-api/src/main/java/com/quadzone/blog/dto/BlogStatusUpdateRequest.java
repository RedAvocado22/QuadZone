package com.quadzone.blog.dto;

import com.quadzone.blog.BlogStatus;
import jakarta.validation.constraints.NotNull;

/**
 * Request DTO for updating blog status only.
 * Used in PATCH /api/v1/blogs/admin/{id}/status endpoint
 * 
 * Validation ensures:
 * - Status is required and valid (DRAFT, PUBLISHED, ARCHIVED)
 * - Cannot publish blog without featured image (validated in service)
 * - Cannot publish blog with empty content (validated in service)
 */
public record BlogStatusUpdateRequest(
        @NotNull(message = "Status cannot be null")
        BlogStatus status
) {
}
