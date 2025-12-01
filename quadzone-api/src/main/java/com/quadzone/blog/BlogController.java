package com.quadzone.blog;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.quadzone.blog.dto.BlogDetailResponse;
import com.quadzone.blog.dto.BlogOverviewResponse;
import com.quadzone.global.dto.PagedResponse;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@Tag(name = "Blog", description = "Blog management endpoints")
public class BlogController {
    private final BlogService blogService;

    /**
     * Get all blog posts with pagination
     */
    
}
