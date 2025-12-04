package com.quadzone.blog.comment;

import java.util.List;

import org.springframework.stereotype.Service;

import com.quadzone.blog.Blog;
import com.quadzone.blog.BlogRepository;
import com.quadzone.blog.comment.dto.AddCommentRequest;
import com.quadzone.blog.comment.dto.CommentResponse;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class CommentService {
    private final CommentRepository commentRepository;
    private final BlogRepository blogRepository;

    public List<CommentResponse> getCommentsForBlog(Long blogId) {
        return commentRepository.findAllByBlogId(blogId)
                .stream()
                .map(CommentResponse::from)
                .toList();
    }

    public CommentResponse addCommentToBlog(Long blogId, AddCommentRequest request) {
        Blog blog = blogRepository.findById(blogId)
                .orElseThrow(() -> new RuntimeException("Blog not found with id: " + blogId));
        
        Comment comment = AddCommentRequest.toComment(request, blog);
        Comment savedComment = commentRepository.save(comment);
        return CommentResponse.from(savedComment);
    }
}
