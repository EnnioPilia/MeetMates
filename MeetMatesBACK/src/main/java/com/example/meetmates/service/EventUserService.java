package com.example.meetmates.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.meetmates.model.core.Event;
import com.example.meetmates.model.core.EventUser;
import com.example.meetmates.model.core.EventUser.ParticipantRole;
import com.example.meetmates.model.core.EventUser.ParticipationStatus;
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

    /**
     * Lorsqu’un utilisateur rejoint un événement.
     * Son statut de participation est PENDING par défaut.
     */
    public EventUser joinEvent(UUID eventId, UUID userId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Événement introuvable"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Utilisateur introuvable"));

        // Vérifier s’il est déjà inscrit
        if (eventUserRepository.existsByEventIdAndUserId(eventId, userId)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Déjà inscrit à cet événement");
        }

        // Vérifier si l’événement est complet
        if (event.getMaxParticipants() != null
                && event.getParticipants().size() >= event.getMaxParticipants()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Événement complet");
        }

        EventUser eventUser = new EventUser();
        eventUser.setEvent(event);
        eventUser.setUser(user);
        eventUser.setRole(EventUser.ParticipantRole.PARTICIPANT);
        eventUser.setParticipationStatus(ParticipationStatus.PENDING); // ✅ Nouveau statut
        eventUser.setJoinedAt(LocalDateTime.now());

        return eventUserRepository.save(eventUser);
    }

    /**
     * Accepter un participant.
     */
    public EventUser acceptParticipant(UUID eventUserId) {
        EventUser eu = eventUserRepository.findById(eventUserId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Participant introuvable"));
        eu.setParticipationStatus(ParticipationStatus.ACCEPTED);
        return eventUserRepository.save(eu);
    }

    /**
     * Rejeter un participant.
     */
    public EventUser rejectParticipant(UUID eventUserId) {
        EventUser eu = eventUserRepository.findById(eventUserId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Participant introuvable"));
        eu.setParticipationStatus(ParticipationStatus.REJECTED);
        return eventUserRepository.save(eu);
    }

    /**
     * L’utilisateur quitte un événement.
     */
    public void leaveEvent(UUID eventId, UUID userId) {
        EventUser eu = eventUserRepository.findByEventIdAndUserId(eventId, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Non inscrit à cet événement"));
        eventUserRepository.delete(eu);
    }

    public List<EventUser> findByUserId(UUID userId) {
        return eventUserRepository.findAllByUserId(userId);
    }

    public List<EventUser> findOrganizedByUserId(UUID userId) {
        return eventUserRepository.findAllByUserIdAndRole(userId, ParticipantRole.ORGANIZER);
    }
}
