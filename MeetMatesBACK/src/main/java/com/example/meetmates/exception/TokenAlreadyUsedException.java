package com.example.meetmates.exception;

public class TokenAlreadyUsedException extends RuntimeException {
    public TokenAlreadyUsedException(String message) {
        super(message);
    }
}
