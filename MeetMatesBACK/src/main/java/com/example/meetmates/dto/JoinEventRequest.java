package com.example.meetmates.dto;

import java.util.UUID;

public record JoinEventRequest(UUID eventId, UUID userId) {}
