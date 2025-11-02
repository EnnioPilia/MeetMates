package com.example.meetmates.dto;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import com.example.meetmates.model.Event;
import com.example.meetmates.model.Event.EventStatus;
import com.example.meetmates.model.Event.Level;
import com.example.meetmates.model.Event.MaterialOption;
import com.example.meetmates.model.EventUser.ParticipantRole;

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
        UUID activityId,
        String activityName,
        String addressLabel,
        String organizerName,
        List<String> participantNames
) {

    public static EventResponse from(Event e) {
        if (e == null) return null;

        String organizerName = e.getParticipants().stream()
                .filter(p -> p.getRole() == ParticipantRole.ORGANIZER)
                .findFirst()
                .map(p -> p.getUser().getFirstName() + " " + p.getUser().getLastName())
                .orElse("Inconnu");

        List<String> participantNames = e.getParticipants().stream()
                .filter(p -> p.getRole() == ParticipantRole.PARTICIPANT)
                .map(p -> p.getUser().getFirstName() + " " + p.getUser().getLastName())
                .collect(Collectors.toList());

        UUID activityId = e.getActivity() != null ? e.getActivity().getId() : null;
        String activityName = e.getActivity() != null ? e.getActivity().getName() : null;
        String addressLabel = e.getAddress() != null ? e.getAddress().getFullAddress() : null;

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
                activityId,
                activityName,
                addressLabel,
                organizerName,
                participantNames
        );
    }
}
