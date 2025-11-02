package com.example.meetmates.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.example.meetmates.dto.EventResponse;
import com.example.meetmates.dto.EventUserDTO;
import com.example.meetmates.model.Event;
import com.example.meetmates.model.EventUser;
import com.example.meetmates.model.User;

@Component
public class EventMapper {

    public EventResponse toResponse(Event e) {
        String organizerName = e.getParticipants().stream()
                .filter(p -> p.getRole() == EventUser.ParticipantRole.ORGANIZER)
                .findFirst()
                .map(p -> p.getUser().getFirstName() + " " + p.getUser().getLastName())
                .orElse("Inconnu");

        List<String> participantNames = e.getParticipants().stream()
                .filter(p -> p.getRole() == EventUser.ParticipantRole.PARTICIPANT)
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
                e.getActivity() != null ? e.getActivity().getId() : null,  
                e.getActivity() != null ? e.getActivity().getName() : null, 
                e.getAddress() != null ? e.getAddress().getFullAddress() : null,
                organizerName,
                participantNames
        );
    }

    public EventUserDTO toEventUserDTO(EventUser eu) {
        Event event = eu.getEvent();
        User user = eu.getUser();

        return new EventUserDTO(
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
