package com.example.meetmates.dto;

import java.time.format.DateTimeFormatter;
import java.util.UUID;

import com.example.meetmates.model.core.Event;
import com.example.meetmates.model.core.EventUser;
import com.example.meetmates.model.core.User;

public record EventUserDTO(
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
        String addressLabel
)
 {

    public static EventUserDTO from(EventUser eu) {
        Event e = eu.getEvent();
        User u = eu.getUser();
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

        return new EventUserDTO(
                eu.getId(),
                e.getId(),
                e.getTitle(),
                e.getDescription(),
                u.getId(),
                u.getFirstName(),
                u.getLastName(),
                u.getEmail(),
                eu.getRole().name(),
                eu.getParticipationStatus().name(),
                eu.getJoinedAt() != null ? eu.getJoinedAt().format(fmt) : null,
                e.getStatus().name(), // ✅ ajouté
                e.getEventDate().toString(), // ✅ ajouté
                e.getAddress() != null ? e.getAddress().getFullAddress() : null // ✅ ici la correction
        );
    }
}
