package com.example.meetmates.service;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.meetmates.model.core.Event;
import com.example.meetmates.model.core.EventUser;
import com.example.meetmates.model.core.User;
import com.example.meetmates.repository.EventRepository;
import com.example.meetmates.repository.EventUserRepository;
import com.example.meetmates.repository.UserRepository;

@Service
public class EventUserService {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final EventUserRepository eventUserRepository;

    public EventUserService(EventRepository eventRepository, UserRepository userRepository,
                            EventUserRepository eventUserRepository) {
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
        this.eventUserRepository = eventUserRepository;
    }

    public EventUser joinEvent(UUID eventId, UUID userId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Événement introuvable"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Utilisateur introuvable"));

        // Vérif si déjà inscrit
        if (eventUserRepository.existsByEventIdAndUserId(eventId, userId)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Déjà inscrit à cet événement");
        }

        // Vérif si plein
        if (event.getMaxParticipants() != null &&
                event.getParticipants().size() >= event.getMaxParticipants()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Événement complet");
        }

        EventUser eventUser = new EventUser();
        eventUser.setEvent(event);
        eventUser.setUser(user);
        eventUser.setRole(EventUser.ParticipantRole.PARTICIPANT);
        eventUser.setJoinedAt(LocalDateTime.now());

        return eventUserRepository.save(eventUser);
    }

    public void leaveEvent(UUID eventId, UUID userId) {
        EventUser eu = eventUserRepository.findByEventIdAndUserId(eventId, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Non inscrit à cet événement"));
        eventUserRepository.delete(eu);
    }
}
