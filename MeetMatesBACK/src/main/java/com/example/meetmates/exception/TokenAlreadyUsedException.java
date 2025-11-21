package com.example.meetmates.exception;

public class TokenAlreadyUsedException extends TokenException {

    public TokenAlreadyUsedException() {
        super("Token déjà utilisé.");
    }

    public TokenAlreadyUsedException(String message) {
        super(message);
    }
}
