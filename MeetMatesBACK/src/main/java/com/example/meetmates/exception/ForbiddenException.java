package com.example.meetmates.exception;

public class ForbiddenException extends RuntimeException {

    private final ErrorCode errorCode;

    public ForbiddenException(ErrorCode errorCode) {
        super(errorCode.name());
        this.errorCode = errorCode;
    }

    public ErrorCode getErrorCode() {
        return errorCode;
    }
}
