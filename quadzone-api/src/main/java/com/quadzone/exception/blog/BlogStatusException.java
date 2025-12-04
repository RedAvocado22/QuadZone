package com.quadzone.exception.blog;

/**
 * Exception thrown when blog status transition is invalid
 * e.g., attempting to publish without required fields
 */
public class BlogStatusException extends RuntimeException {
    public BlogStatusException(String message) {
        super(message);
    }
}
