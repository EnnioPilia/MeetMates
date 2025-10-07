package com.example.meetmates.dto;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import com.example.meetmates.model.core.Event;
import com.example.meetmates.model.core.Event.EventStatus;
import com.example.meetmates.model.core.Event.Level;
import com.example.meetmates.model.core.Event.MaterialOption;
import com.example.meetmates.model.core.EventUser;
import com.example.meetmates.model.core.EventUser.ParticipantRole;

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
    String organizerName,
    List<String> participantNames
) {

    public static EventResponse from(Event e) {
        // ✅ Trouver l’organisateur
        String organizerName = e.getParticipants().stream()
                .filter(p -> p.getRole() == ParticipantRole.ORGANIZER)
                .findFirst()
                .map(p -> p.getUser().getFirstName() + " " + p.getUser().getLastName())
                .orElse("Inconnu");

        // ✅ Récupérer tous les participants (hors organisateur)
        List<String> participantNames = e.getParticipants().stream()
                .filter(p -> p.getRole() == ParticipantRole.PARTICIPANT)
                .map(p -> p.getUser().getFirstName() + " " + p.getUser().getLastName())
                .collect(Collectors.toList());

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
                e.getAddress() != null ? e.getAddress().getFullAddress() : null,
                organizerName,
                participantNames
        );
    }
}
