package com.quadzone.exception.blog;

/**
 * Exception thrown when a blog post is not found
 */
public class BlogNotFoundException extends RuntimeException {
    public BlogNotFoundException(Long id) {
        super("Blog not found with id: " + id);
    }

    public BlogNotFoundException(String message) {
        super(message);
    }
}
