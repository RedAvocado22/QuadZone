package com.quadzone.blog;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.quadzone.blog.dto.AddBlogRequest;
import com.quadzone.blog.dto.BlogDetailResponse;
import com.quadzone.blog.dto.BlogOverviewResponse;
import com.quadzone.blog.dto.UpdateBlogRequest;
import com.quadzone.blog.dto.BlogStatusUpdateRequest;
import com.quadzone.global.dto.PagedResponse;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/blogs")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
@Tag(name = "Blog API", description = "Blog management API for creating, updating, and managing blog posts. Supports admin operations for full blog CRUD.")
public class BlogController {

    

}
