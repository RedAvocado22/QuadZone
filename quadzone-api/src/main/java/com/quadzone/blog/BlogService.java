package com.quadzone.blog;

import java.text.Normalizer;
import java.time.LocalDateTime;
import java.util.List;
import java.util.regex.Pattern;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.quadzone.blog.comment.CommentService;
import com.quadzone.blog.comment.dto.AddCommentRequest;
import com.quadzone.blog.dto.AddBlogRequest;
import com.quadzone.blog.dto.BlogDetailResponse;
import com.quadzone.blog.dto.BlogOverviewResponse;
import com.quadzone.blog.dto.UpdateBlogRequest;
import com.quadzone.global.dto.PagedResponse;
import com.quadzone.user.User;
import com.quadzone.user.UserRepository;
import com.quadzone.utils.EntityMapper;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Service for blog management operations.
 * 
 * Responsibilities:
 * - Blog CRUD operations (Create, Read, Update, Delete)
 * - Slug generation and validation
 * - Status workflow management
 * - Comment handling
 * 
 * All write operations are transactional to ensure data consistency.
 */
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class BlogService {
    private final BlogRepository blogRepository;
    private final UserRepository userRepository;
    private final EntityMapper objectMapper;
    private final CommentService commentService;

    /**
     * Get paginated list of all blogs for admin dashboard
     * Useful for admin dashboard with search support
     * 
     * @param page page number (0-indexed)
     * @param size page size
     * @param search search query (searches in title and content)
     * @return paginated response with blog details
     */
    public PagedResponse<BlogDetailResponse> findBlogsForAdmin(int page, int size, String search) {
        Pageable pageable = PageRequest.of(page, size);
        
        try {
            Page<Blog> blogs;
            if (search != null && !search.trim().isEmpty()) {
                blogs = blogRepository.searchByTitleOrContent(search.trim(), pageable);
            } else {
                blogs = blogRepository.findAll(pageable);
            }
            
            return new PagedResponse<>(
                    blogs.getContent().stream().map(BlogDetailResponse::from).toList(),
                    blogs.getTotalElements(),
                    blogs.getNumber(),
                    blogs.getSize()
            );
        } catch (Exception e) {
            log.error("Error fetching blogs for admin", e);
            return new PagedResponse<>(List.of(), 0, page, size);
        }
    }

    /**
     * Get paginated list of all blogs
     * Useful for admin dashboard
     * 
     * @param pageable pagination info
     * @return paginated blog overviews
     */
    public Page<BlogOverviewResponse> getBlogs(Pageable pageable) {
        if (pageable == null) {
            throw new IllegalArgumentException("Pagination parameters required");
        }
        try {
            Page<Blog> page = blogRepository.findAll(pageable);
            return page.map(objectMapper::toBlogResponse);
        } catch (Exception e) {
            log.error("Error fetching blogs", e);
            return Page.empty(pageable);
        }
    }

    /**
     * Get full blog detail by ID (for editing or display)
     * Includes all comments
     * 
     * @param id blog ID
     * @return blog detail with comments
     * @throws RuntimeException if blog not found
     */
    public BlogDetailResponse getBlogById(Long id) {
        Blog blog = blogRepository.findByIdWithComments(id)
                .orElseThrow(() -> new RuntimeException("Blog not found with id: " + id));
        return BlogDetailResponse.from(blog);
    }

    /**
     * Get blog by slug (for public display)
     * Includes all comments
     * 
     * @param slug blog slug
     * @return blog detail with comments
     * @throws RuntimeException if blog not found
     */
    public BlogDetailResponse getBlogBySlug(String slug) {
        Blog blog = blogRepository.findBySlugWithComments(slug)
                .orElseThrow(() -> new RuntimeException("Blog not found with slug: " + slug));
        return BlogDetailResponse.from(blog);
    }

    /**
     * Create new blog post
     * 
     * Validation:
     * - Title must be unique
     * - Generates SEO-friendly slug from title
     * - Slug must be unique
     * - Author must exist
     * - Sets initial status to DRAFT
     * 
     * @param request blog creation request
     * @return created blog detail
     * @throws RuntimeException if validation fails
     */
    public BlogDetailResponse createBlog(AddBlogRequest request) {
        log.info("Creating new blog with title: {}", request.title());
        
        // Validate title uniqueness
        if (blogRepository.existsByTitleIgnoreCase(request.title())) {
            throw new RuntimeException("Blog title already exists: " + request.title());
        }

        // Load author from database
        User author = userRepository.findById(request.authorId())
                .orElseThrow(() -> new RuntimeException("Author not found with id: " + request.authorId()));

        // Generate unique slug from title
        String baseSlug = generateSlug(request.title());
        String slug = baseSlug;
        int counter = 1;
        
        // If slug exists, append number until unique
        while (blogRepository.findBySlug(slug).isPresent()) {
            slug = baseSlug + "-" + counter;
            counter++;
        }

        // Create blog entity
        Blog blog = AddBlogRequest.toBlog(request, slug, author);
        Blog saved = blogRepository.save(blog);

        log.info("Blog created successfully with id: {} and slug: {}", saved.getId(), saved.getSlug());
        return BlogDetailResponse.from(saved);
    }

    /**
     * Update existing blog post
     * 
     * Validation:
     * - Blog must exist
     * - If slug changed, must be unique
     * - If title changed, must be unique
     * - Partial updates supported (only provided fields updated)
     * 
     * @param id blog ID to update
     * @param request blog update request
     * @return updated blog detail
     * @throws RuntimeException if blog not found or validation fails
     */
    public BlogDetailResponse updateBlog(Long id, UpdateBlogRequest request) {
        log.info("Updating blog with id: {}", id);
        
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Blog not found with id: " + id));

        // Validate slug uniqueness if changed
        if (request.title() != null && !request.title().trim().isEmpty()) {
            if (blogRepository.existsByTitleAndNotId(request.title(), id)) {
                throw new RuntimeException("Blog title already exists: " + request.title());
            }
        }

        // Apply updates (only non-null fields)
        request.applyTo(blog);
        
        Blog updated = blogRepository.save(blog);
        log.info("Blog updated successfully with id: {}", id);
        
        return BlogDetailResponse.from(updated);
    }

    /**
     * Update blog status (DRAFT, PUBLISHED, ARCHIVED)
     * 
     * Workflow validation:
     * - Cannot publish without featured image
     * - Cannot publish with empty content
     * - Can transition from any state to any valid state
     * 
     * @param id blog ID
     * @param newStatus new blog status
     * @return updated blog detail
     * @throws RuntimeException if blog not found or validation fails
     */
    public BlogDetailResponse updateBlogStatus(Long id, BlogStatus newStatus) {
        log.info("Updating blog status for id: {} to: {}", id, newStatus);
        
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Blog not found with id: " + id));

        // Validate publish requirements
        if (newStatus == BlogStatus.PUBLISHED) {
            if (blog.getThumbnailUrl() == null || blog.getThumbnailUrl().trim().isEmpty()) {
                throw new RuntimeException("Cannot publish blog without featured image");
            }
            if (blog.getContent() == null || blog.getContent().trim().isEmpty()) {
                throw new RuntimeException("Cannot publish blog with empty content");
            }
        }

        blog.setStatus(newStatus);
        Blog updated = blogRepository.save(blog);
        
        log.info("Blog status updated successfully to: {}", newStatus);
        return BlogDetailResponse.from(updated);
    }

    /**
     * Delete blog post permanently
     * 
     * @param id blog ID
     * @throws RuntimeException if blog not found
     */
    public void deleteBlog(Long id) {
        log.info("Deleting blog with id: {}", id);
        
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Blog not found with id: " + id));
        
        blogRepository.delete(blog);
        log.info("Blog deleted successfully with id: {}", id);
    }

    /**
     * Add comment to blog post
     * 
     * @param blogId blog ID
     * @param request comment request
     */
    public void addCommentToBlog(Long blogId, AddCommentRequest request) {
        commentService.addCommentToBlog(blogId, request);
    }

    /**
     * Change blog status (deprecated - use updateBlogStatus instead)
     * Kept for backward compatibility
     * 
     * @param blogId blog ID
     * @param newStatus new status
     */
    @Deprecated(forRemoval = true)
    public void changeBlogStatus(Long blogId, BlogStatus newStatus) {
        updateBlogStatus(blogId, newStatus);
    }

    /**
     * Generate SEO-friendly slug from title
     * 
     * Process:
     * 1. Convert to lowercase
     * 2. Remove accents and special characters
     * 3. Replace spaces with hyphens
     * 4. Remove multiple consecutive hyphens
     * 5. Trim hyphens from start/end
     * 
     * Example: "Getting Started with React! 🚀" → "getting-started-with-react"
     * 
     * @param title blog title
     * @return slug
     */
    private String generateSlug(String title) {
        if (title == null || title.trim().isEmpty()) {
            return "blog-" + System.currentTimeMillis();
        }

        // Normalize Unicode and remove accents
        String normalized = Normalizer.normalize(title.trim(), Normalizer.Form.NFD);
        String noAccents = normalized.replaceAll("\\p{M}", "");

        // Convert to lowercase
        String lowercased = noAccents.toLowerCase();

        // Replace spaces and special chars with hyphens, keep only alphanumeric and hyphens
        String slug = lowercased.replaceAll("[^a-z0-9]+", "-");

        // Remove multiple consecutive hyphens
        slug = slug.replaceAll("-+", "-");

        // Remove leading/trailing hyphens
        slug = slug.replaceAll("^-|-$", "");

        // Ensure slug is not empty
        if (slug.isEmpty()) {
            slug = "blog-" + System.currentTimeMillis();
        }

        return slug;
    }
}
