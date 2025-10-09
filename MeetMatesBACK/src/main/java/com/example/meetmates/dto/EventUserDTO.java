package com.example.meetmates.dto;

import java.util.UUID;

import com.example.meetmates.model.core.EventUser;

public record EventUserDTO(
        UUID id,
        UUID eventId,
        String eventTitle,
        UUID userId,
        String firstName,
        String lastName
        // List<String> participantNames 
        ) {

    public static EventUserDTO from(EventUser eventUser) {
        var user = eventUser.getUser();

        return new EventUserDTO(
                eventUser.getId(),
                eventUser.getEvent().getId(),
                eventUser.getEvent().getTitle(),
                user.getId(),
                user.getFirstName(),
                user.getLastName()
        );
    }
}
