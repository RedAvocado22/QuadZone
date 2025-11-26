package com.quadzone.upload.dto;

import jakarta.validation.constraints.Size;

public record UploadRequest(
        @Size(max = 500, message = "Description must not exceed 500 characters")
        String description
) {
}
