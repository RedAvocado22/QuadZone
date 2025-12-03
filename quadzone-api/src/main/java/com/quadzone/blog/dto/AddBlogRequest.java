package com.quadzone.blog.dto;

import com.quadzone.blog.Blog;
import com.quadzone.blog.BlogStatus;
import com.quadzone.user.User;
import jakarta.validation.constraints.*;

public record AddBlogRequest(

        @NotBlank(message = "Title cannot be blank")
        @Size(min = 5, max = 200, message = "Title must be between 5 and 200 characters")
        String title,

        @NotBlank(message = "Content cannot be empty")
        String content,

        @Size(max = 500, message = "Thumbnail URL cannot exceed 500 characters")
        String thumbnailUrl,

        @NotNull(message = "Author ID is required")
        Long authorId

) {

    /**
     * Convert DTO → Blog entity.
     * Slug is generated in service layer and injected into this mapper.
     * Author is loaded from DB and passed as a User object.
     */
    public static Blog toBlog(AddBlogRequest request, String slug, User author) {

        String thumbnail = (request.thumbnailUrl() != null && !request.thumbnailUrl().trim().isEmpty())
                ? request.thumbnailUrl().trim()
                : null;

        return Blog.builder()
                .title(request.title())
                .slug(slug)                     // provided by service
                .content(request.content())
                .thumbnailUrl(thumbnail)
                .status(BlogStatus.DRAFT)       // default
                .author(author)                 // full User entity
                .build();
    }
}
