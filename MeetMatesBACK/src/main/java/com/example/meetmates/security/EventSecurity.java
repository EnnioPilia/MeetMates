package com.example.meetmates.security;

import java.util.UUID;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import com.example.meetmates.model.EventUser.ParticipantRole;
import com.example.meetmates.model.User;
import com.example.meetmates.repository.EventUserRepository;
import com.example.meetmates.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Component("eventSecurity")
@RequiredArgsConstructor
public class EventSecurity {

    private final EventUserRepository eventUserRepository;
    private final UserRepository userRepository;

    public boolean isOrganizer(UUID eventId) {

        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return false;
        }

        return eventUserRepository
                .findByEventIdAndUserId(eventId, user.getId())
                .map(eu -> eu.getRole() == ParticipantRole.ORGANIZER)
                .orElse(false);
    }

    public boolean isOrganizerByEventUserId(UUID eventUserId) {
        
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return false;
        }

        var eu = eventUserRepository.findById(eventUserId).orElse(null);
        if (eu == null) {
            return false;
        }

        return eventUserRepository
                .findByEventIdAndUserId(eu.getEvent().getId(), user.getId())
                .map(link -> link.getRole() == ParticipantRole.ORGANIZER)
                .orElse(false);
    }

}
