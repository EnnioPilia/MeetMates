package com.example.meetmates.exception;

public class UnauthorizedEventAccessException extends RuntimeException {
    public UnauthorizedEventAccessException(String message) {
        super(message);
    }
}
