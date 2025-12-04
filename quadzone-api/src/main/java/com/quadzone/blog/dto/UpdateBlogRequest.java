package com.quadzone.blog.dto;

import com.quadzone.blog.Blog;
import com.quadzone.blog.BlogStatus;
import jakarta.validation.constraints.*;

public record UpdateBlogRequest(

        @Size(min = 5, max = 200, message = "Title must be between 5 and 200 characters")
        String title,

        String content,

        @Size(max = 500, message = "Thumbnail URL cannot exceed 500 characters")
        String thumbnailUrl,

        // Allow admin/user to change status (optional)
        BlogStatus status

) {

    /**
     * Apply update values to an existing Blog entity.
     * Only non-null fields will overwrite current values.
     */
    public void applyTo(Blog blog) {

        if (this.title != null && !this.title.trim().isEmpty()) {
            blog.setTitle(this.title.trim());
        }

        if (this.content != null && !this.content.trim().isEmpty()) {
            blog.setContent(this.content.trim());
        }

        if (this.thumbnailUrl != null) {
            String thumb = this.thumbnailUrl.trim();
            blog.setThumbnailUrl(!thumb.isEmpty() ? thumb : null);
        }

        if (this.status != null) {
            blog.setStatus(this.status);
        }
    }
}
