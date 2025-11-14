package com.example.meetmates.dto;

import java.util.UUID;

public record JoinEventRequestDto(UUID eventId, UUID userId) {}
