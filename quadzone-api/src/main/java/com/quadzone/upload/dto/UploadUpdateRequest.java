package com.quadzone.upload.dto;

import jakarta.validation.constraints.Size;

public record UploadUpdateRequest(
        @Size(max = 500, message = "Description must not exceed 500 characters")
        String description
) {
}
