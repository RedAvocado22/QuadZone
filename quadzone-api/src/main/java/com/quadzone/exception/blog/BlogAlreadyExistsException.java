package com.quadzone.exception.blog;

/**
 * Exception thrown when attempting to create/update a blog with a title or slug that already exists
 */
public class BlogAlreadyExistsException extends RuntimeException {
    public BlogAlreadyExistsException(String message) {
        super(message);
    }
}
