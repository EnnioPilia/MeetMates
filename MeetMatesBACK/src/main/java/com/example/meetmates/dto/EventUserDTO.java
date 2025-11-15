package com.example.meetmates.dto;

import java.util.UUID;

public record EventUserDto(
        UUID id,
        UUID eventId,
        String eventTitle,
        String eventDescription,
        UUID userId,
        String firstName,
        String lastName,
        String email,
        String role,
        String participationStatus,
        String joinedAt,
        String eventStatus,
        String eventDate,
        String addressLabel,
        String activityName
) {}
