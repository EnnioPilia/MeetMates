package com.example.meetmates.exception;

public class OrganizerCannotJoinException extends RuntimeException {

    public OrganizerCannotJoinException() {
        super("Vous êtes l'organisateur de cet événement et ne pouvez pas y participer.");
    }

    public OrganizerCannotJoinException(String message) {
        super(message);
    }
}
