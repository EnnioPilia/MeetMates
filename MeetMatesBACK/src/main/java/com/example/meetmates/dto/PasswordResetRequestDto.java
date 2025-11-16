package com.example.meetmates.dto;

public class PasswordResetRequestDto {

    private String email;

    public PasswordResetRequestDto() {
    }

    // GETTERS & SETTERS
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}
