package com.quadzone.blog.dto;

import java.time.LocalDateTime;

public record BlogOverviewResponse(
        Long id,
        String title,
        String slug,
        String thumbnailUrl,
        String excerpt,           // short preview text
        String authorName,
        LocalDateTime createdAt
) {

    public static BlogOverviewResponse from(com.quadzone.blog.Blog blog) {

        // Auto-generate excerpt from content (first 150 chars)
        String content = blog.getContent() != null ? blog.getContent() : "";
        String excerpt = content.length() <= 150 
                ? content 
                : content.substring(0, 150) + "...";

        return new BlogOverviewResponse(
                blog.getId(),
                blog.getTitle(),
                blog.getSlug(),
                blog.getThumbnailUrl(),
                excerpt,
                blog.getAuthor() != null ? blog.getAuthor().getFirstName() + " " + blog.getAuthor().getLastName() : "Unknown",
                blog.getCreatedAt()
        );
    }
}
