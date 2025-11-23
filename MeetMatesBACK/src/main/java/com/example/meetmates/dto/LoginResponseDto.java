package com.example.meetmates.dto;

public class LoginResponseDto {

    private final String message;

    public LoginResponseDto(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }
}
