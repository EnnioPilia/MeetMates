package com.example.meetmates.exception;

public class TokenExpiredException extends TokenException {

    public TokenExpiredException() {
        super("Token expiré.");
    }

    public TokenExpiredException(String message) {
        super(message);
    }
}
