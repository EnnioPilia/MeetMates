package com.example.meetmates.dto;

import java.util.List;
import java.util.UUID;

public record EventDetailsDto(
        UUID id,
        String title,
        String description,
        String eventDate,
        String startTime,
        String endTime,
        String addressLabel,
        String activityName,
        String organizerName,
        String level,
        String material,
        String status,
        Integer maxParticipants,
        String participationStatus,
        List<EventUserDto> acceptedParticipants,
        List<EventUserDto> pendingParticipants,
        List<EventUserDto> rejectedParticipants
        ) {
}
