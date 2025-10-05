package com.example.meetmates.dto;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

import com.example.meetmates.model.core.Event;
import com.example.meetmates.model.core.Event.EventStatus;
import com.example.meetmates.model.core.Event.Level;
import com.example.meetmates.model.core.Event.MaterialOption;

public record EventResponse(
    UUID id,
    String title,
    String description,
    LocalDate eventDate,
    LocalTime startTime,
    LocalTime endTime,
    Integer maxParticipants,
    EventStatus status,
    MaterialOption material,
    Level level,
    String activityName,
    String addressLabel,
    String organizerName
) {
    public static EventResponse from(Event e) {
        return new EventResponse(
            e.getId(),
            e.getTitle(),
            e.getDescription(),
            e.getEventDate(),
            e.getStartTime(),
            e.getEndTime(),
            e.getMaxParticipants(),
            e.getStatus(),
            e.getMaterial(),
            e.getLevel(),
            e.getActivity() != null ? e.getActivity().getName() : null,
            e.getAddress() != null ? e.getAddress().getCity() + ", " + e.getAddress().getStreet() : null,
            e.getOrganizer() != null ? e.getOrganizer().getFirstName() + " " + e.getOrganizer().getLastName() : null
        );
    }
}
