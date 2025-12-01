package com.quadzone.blog.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.quadzone.blog.Blog;
import com.quadzone.blog.comment.dto.CommentResponse;
import com.quadzone.user.dto.UserResponse;

public record BlogDetailResponse(
        Long id,
        String title,
        String slug,
        String content,
        String thumbnailUrl,
        String status,
        UserResponse author,
        LocalDateTime createdAt,
        List<CommentResponse> comments
) {
    public static BlogDetailResponse from(Blog blog) {
        return new BlogDetailResponse(
                blog.getId(),
                blog.getTitle(),
                blog.getSlug(),
                blog.getContent(),
                blog.getThumbnailUrl(),
                blog.getStatus().name(),
                blog.getAuthor() != null ? UserResponse.from(blog.getAuthor()) : null,
                blog.getCreatedAt(),
                blog.getComments() != null
                        ? blog.getComments()
                            .stream()
                            .map(CommentResponse::from)
                            .toList()
                        : null
        );
    }
}
