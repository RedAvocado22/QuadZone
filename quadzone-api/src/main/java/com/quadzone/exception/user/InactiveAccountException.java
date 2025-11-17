package com.quadzone.exception.user;

public class InactiveAccountException extends RuntimeException {
    public InactiveAccountException(String message) {
        super(message);
    }
}
