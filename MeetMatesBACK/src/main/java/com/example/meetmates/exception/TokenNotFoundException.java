package com.example.meetmates.exception;

public class TokenNotFoundException extends TokenException {

    public TokenNotFoundException() {
        super("Token introuvable.");
    }

    public TokenNotFoundException(String message) {
        super(message);
    }
}
