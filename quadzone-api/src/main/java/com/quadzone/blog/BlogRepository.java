package com.quadzone.blog;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Repository for Blog entity.
 * 
 * Provides custom queries for:
 * - Finding blogs by slug (with and without comments)
 * - Checking slug uniqueness (excluding current blog)
 * - Finding blogs by author
 */
@Repository
public interface BlogRepository extends JpaRepository<Blog, Long> {
    
    /**
     * Find blog by slug without comments
     */
    Optional<Blog> findBySlug(String slug);

    /**
     * Find blog by slug with eager-loaded comments
     * Optimizes single query to avoid N+1 problem
     */
    @Query("SELECT b FROM Blog b LEFT JOIN FETCH b.comments WHERE b.slug = :slug")
    Optional<Blog> findBySlugWithComments(@Param("slug") String slug);

    /**
     * Find blog by ID with eager-loaded comments
     * Optimizes single query to avoid N+1 problem
     */
    @Query("SELECT b FROM Blog b LEFT JOIN FETCH b.comments WHERE b.id = :id")
    Optional<Blog> findByIdWithComments(@Param("id") Long id);

    /**
     * Check if slug exists and does NOT belong to provided blog ID
     * Used for slug uniqueness validation during updates
     * 
     * @param slug the slug to check
     * @param excludeBlogId the blog ID to exclude (for updates)
     * @return true if slug exists for another blog, false otherwise
     */
    @Query("SELECT COUNT(b) > 0 FROM Blog b WHERE b.slug = :slug AND b.id != :excludeBlogId")
    boolean existsBySlugAndNotId(@Param("slug") String slug, @Param("excludeBlogId") Long excludeBlogId);

    /**
     * Check if title exists and does NOT belong to provided blog ID
     * Used for title uniqueness validation
     * 
     * @param title the title to check
     * @param excludeBlogId the blog ID to exclude (for updates)
     * @return true if title exists for another blog, false otherwise
     */
    @Query("SELECT COUNT(b) > 0 FROM Blog b WHERE LOWER(b.title) = LOWER(:title) AND b.id != :excludeBlogId")
    boolean existsByTitleAndNotId(@Param("title") String title, @Param("excludeBlogId") Long excludeBlogId);

    /**
     * Check if title already exists
     * Used for title uniqueness validation during creation
     */
    @Query("SELECT COUNT(b) > 0 FROM Blog b WHERE LOWER(b.title) = LOWER(:title)")
    boolean existsByTitleIgnoreCase(@Param("title") String title);

    /**
     * Search blogs by title or content
     * Case-insensitive search for admin dashboard
     * 
     * @param search the search query
     * @param pageable pagination info
     * @return paginated search results
     */
    @Query("SELECT b FROM Blog b WHERE LOWER(b.title) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(b.content) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "ORDER BY b.createdAt DESC")
    Page<Blog> searchByTitleOrContent(@Param("search") String search, Pageable pageable);
}
