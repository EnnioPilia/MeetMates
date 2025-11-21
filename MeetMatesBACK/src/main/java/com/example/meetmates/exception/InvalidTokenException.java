package com.example.meetmates.exception;

public class InvalidTokenException extends TokenException {

    public InvalidTokenException() {
        super("Token invalide.");
    }

    public InvalidTokenException(String message) {
        super(message);
    }
}
