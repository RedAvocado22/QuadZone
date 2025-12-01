package com.quadzone.blog;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface BlogRepository extends JpaRepository<Blog, Long> {
    Optional<Blog> findBySlug(String slug);

    @Query("SELECT b FROM Blog b LEFT JOIN FETCH b.comments WHERE b.slug = :slug")
    Optional<Blog> findBySlugWithComments(@Param("slug") String slug);

    @Query("SELECT b FROM Blog b LEFT JOIN FETCH b.comments WHERE b.id = :id")
    Optional<Blog> findByIdWithComments(@Param("id") Long id);
}
