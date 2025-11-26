package com.example.meetmates.exception;

public class ConflictException extends RuntimeException {

    private final ErrorCode errorCode;

    public ConflictException(ErrorCode errorCode) {
        super(errorCode.name());
        this.errorCode = errorCode;
    }

    public ErrorCode getErrorCode() {
        return errorCode;
    }
}
