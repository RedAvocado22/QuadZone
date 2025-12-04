package com.quadzone.blog.comment.dto;



import java.time.LocalDateTime;

import com.quadzone.blog.comment.Comment;

public record CommentResponse(
        Long id,
        String authorName,
        String authorEmail,
        String content,
        LocalDateTime createdAt
) {
    public static CommentResponse from(Comment comment) {
        return new CommentResponse(
                comment.getId(),
                comment.getAuthorName(),
                comment.getAuthorEmail(),
                comment.getContent(),
                comment.getCreatedAt()
        );
    }
}