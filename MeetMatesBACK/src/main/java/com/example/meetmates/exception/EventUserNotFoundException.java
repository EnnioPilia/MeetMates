package com.example.meetmates.exception;

public class EventUserNotFoundException extends RuntimeException {
    public EventUserNotFoundException(String message) {
        super(message);
    }
}
