package com.example.meetmates.exception;

public class AlreadyParticipantException extends RuntimeException {
    public AlreadyParticipantException(String message) {
        super(message);
    }
}
