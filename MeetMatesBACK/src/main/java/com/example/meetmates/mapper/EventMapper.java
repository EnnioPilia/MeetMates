package com.example.meetmates.mapper;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.example.meetmates.dto.EventResponseDto;
import com.example.meetmates.dto.EventUserDto;
import com.example.meetmates.model.Event;
import com.example.meetmates.model.EventUser;
import com.example.meetmates.model.User;

@Component
public class EventMapper {

    public EventResponseDto toResponse(Event e) {

        var organizerOpt = e.getParticipants().stream()
                .filter(p -> p.getRole() == EventUser.ParticipantRole.ORGANIZER)
                .findFirst();

        UUID organizerId = organizerOpt
                .map(p -> p.getUser().getId())
                .orElse(null);

        String organizerName = organizerOpt
                .map(p -> p.getUser().getFirstName() + " " + p.getUser().getLastName())
                .orElse("Inconnu");

        List<String> participantNames = e.getParticipants().stream()
                .filter(p -> p.getRole() == EventUser.ParticipantRole.PARTICIPANT)
                .map(p -> p.getUser().getFirstName() + " " + p.getUser().getLastName())
                .collect(Collectors.toList());

        return new EventResponseDto(
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
                e.getActivity() != null ? e.getActivity().getId() : null,
                e.getActivity() != null ? e.getActivity().getName() : null,
                e.getAddress() != null ? e.getAddress().getFullAddress() : null,
                organizerId,          
                organizerName,
                participantNames
        );
    }

    public EventUserDto EventUserDto(EventUser eu) {
        Event event = eu.getEvent();
        User user = eu.getUser();

        return new EventUserDto(
                eu.getId(),
                event.getId(),
                event.getTitle(),
                event.getDescription(),
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                eu.getRole().name(),
                eu.getParticipationStatus().name(),
                eu.getJoinedAt() != null ? eu.getJoinedAt().toString() : null,
                event.getStatus().name(),
                event.getEventDate().toString(),
                event.getAddress() != null ? event.getAddress().getFullAddress() : null,
                event.getActivity() != null ? event.getActivity().getName() : null
        );
    }
}
