package com.quadzone.upload.dto;

import com.quadzone.upload.Upload;

import java.time.LocalDateTime;

public record UploadResponse(
        Long id,
        String fileName,
        String imageUrl,
        String thumbnailUrl,
        String description,
        Long fileSize,
        String mimeType,
        LocalDateTime uploadedAt
) {
    public static UploadResponse from(Upload upload) {
        return new UploadResponse(
                upload.getId(),
                upload.getFileName(),
                upload.getImageUrl(),
                upload.getThumbnailUrl(),
                upload.getDescription(),
                upload.getFileSize(),
                upload.getMimeType(),
                upload.getUploadedAt()
        );
    }
}
