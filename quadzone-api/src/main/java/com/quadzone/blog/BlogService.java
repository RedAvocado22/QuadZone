package com.quadzone.blog;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.quadzone.blog.comment.CommentService;
import com.quadzone.blog.comment.dto.AddCommentRequest;
import com.quadzone.blog.dto.BlogDetailResponse;
import com.quadzone.blog.dto.BlogOverviewResponse;
import com.quadzone.utils.EntityMapper;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class BlogService {
    private final BlogRepository blogRepository;
    private final EntityMapper objectMapper;
    private final CommentService commentService;

    public Page<BlogOverviewResponse> getBlogs(Pageable pageable) {
        if (pageable == null) {
            throw new IllegalArgumentException("No blogs found");
        }
        try {
            Page<Blog> page = blogRepository.findAll(pageable);
            return page.map(objectMapper::toBlogResponse);
        } catch (Exception e) {
            // Return empty page if there's an issue
            return Page.empty(pageable);
        }

    }

    public BlogDetailResponse getBlogById(Long id) {
        Blog blog = blogRepository.findByIdWithComments(id)
                .orElseThrow(() -> new RuntimeException("Blog not found with id: " + id));
        return BlogDetailResponse.from(blog);
    }

    public BlogDetailResponse getBlogBySlug(String slug) {
        Blog blog = blogRepository.findBySlugWithComments(slug)
                .orElseThrow(() -> new RuntimeException("Blog not found with slug: " + slug));
        return BlogDetailResponse.from(blog);
    }

    public void addCommentToBlog(Long blogId, AddCommentRequest request) {
        commentService.addCommentToBlog(blogId, request);
    }
}
