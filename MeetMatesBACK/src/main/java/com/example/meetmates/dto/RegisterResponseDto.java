package com.example.meetmates.dto;

public class RegisterResponseDto {
    private String message;

    public RegisterResponseDto(String message) {
        this.message = message;
    }

    public String getMessage() { return message; }
}
