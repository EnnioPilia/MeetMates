package com.example.meetmates.dto;

import java.util.UUID;

public record UserDto(
        UUID id,
        String firstName,
        String lastName,
        String email,
        Integer age,
        String city,
        String profilePictureUrl
) {}
