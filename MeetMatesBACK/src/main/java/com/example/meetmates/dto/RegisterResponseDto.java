package com.example.meetmates.dto;

public class RegisterResponseDto {
    private final String message;

    public RegisterResponseDto(String message) {
        this.message = message;
    }

    public String getMessage() { return message; }
}
