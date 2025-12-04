package com.quadzone.blog.comment.dto;

import com.quadzone.blog.Blog;
import com.quadzone.blog.comment.Comment;
import jakarta.validation.constraints.*;

public record AddCommentRequest(

        @NotBlank(message = "Author name cannot be blank")
        @Size(max = 150, message = "Author name cannot exceed 150 characters")
        String authorName,

        @Email(message = "Invalid email format")
        @NotBlank(message = "Email cannot be blank")
        @Size(max = 150, message = "Email cannot exceed 150 characters")
        String authorEmail,

        @NotBlank(message = "Comment content cannot be empty")
        @Size(min = 3, message = "Comment must be at least 3 characters long")
        String content

) {
    public static Comment toComment(AddCommentRequest request, Blog blog) {
        return Comment.builder()
                .blog(blog)
                .authorName(request.authorName())
                .authorEmail(request.authorEmail())
                .content(request.content())
                .build(); 
    }
}
