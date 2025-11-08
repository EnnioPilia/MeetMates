package com.example.meetmates.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.example.meetmates.model.Event;
import com.example.meetmates.model.EventUser;
import com.example.meetmates.model.EventUser.ParticipantRole;
import com.example.meetmates.model.EventUser.ParticipationStatus;
import com.example.meetmates.model.User;
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

        boolean isOrganizer = event.getParticipants().stream()
                .anyMatch(eu -> eu.getUser().getId().equals(user.getId())
                && eu.getRole() == EventUser.ParticipantRole.ORGANIZER);

        if (isOrganizer) {
            return eventUserRepository.findByEventIdAndUserId(eventId, userId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Organisateur non trouvé"));
        }

        Optional<EventUser> existingOpt = eventUserRepository.findByEventIdAndUserId(eventId, userId);

            if (existingOpt.isPresent()) {
                EventUser existing = existingOpt.get();
                
            if (existing.getRole() == EventUser.ParticipantRole.ORGANIZER) {
                return existing;
            }

            switch (existing.getParticipationStatus()) {
                case REJECTED, LEFT_REJECTED -> {
                    throw new ResponseStatusException(HttpStatus.GONE, "Vous avez été retiré de cette activité et ne pouvez pas la rejoindre à nouveau.");
                }
                case ACCEPTED, PENDING -> {
                    throw new ResponseStatusException(HttpStatus.CONFLICT, "Vous participez déjà à cet événement.");
                }
                case LEFT -> {
                    existing.setParticipationStatus(ParticipationStatus.PENDING);
                    existing.setJoinedAt(LocalDateTime.now());
                    return eventUserRepository.save(existing);
                }
                default ->
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Statut invalide");
            }
        }

        if (event.getMaxParticipants() != null
                && event.getParticipants().size() >= event.getMaxParticipants()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Événement complet");
        }

        EventUser eventUser = new EventUser();
        eventUser.setEvent(event);
        eventUser.setUser(user);
        eventUser.setUserEmail(user.getEmail());
        eventUser.setRole(ParticipantRole.PARTICIPANT);
        eventUser.setParticipationStatus(ParticipationStatus.PENDING);
        eventUser.setJoinedAt(LocalDateTime.now());

        return eventUserRepository.save(eventUser);
    }

    public EventUser acceptParticipant(UUID eventUserId) {
        EventUser eu = eventUserRepository.findById(eventUserId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Participant introuvable"));
        eu.setParticipationStatus(ParticipationStatus.ACCEPTED);
        return eventUserRepository.save(eu);
    }

    public EventUser rejectParticipant(UUID eventUserId) {
        EventUser eu = eventUserRepository.findById(eventUserId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Participant introuvable"));
        eu.setParticipationStatus(ParticipationStatus.REJECTED);
        return eventUserRepository.save(eu);
    }

    public EventUser leaveEvent(UUID eventId, UUID userId) {
        EventUser eu = eventUserRepository.findByEventIdAndUserId(eventId, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Non inscrit à cet événement"));

        if (eu.getParticipationStatus() == ParticipationStatus.REJECTED) {
            eu.setParticipationStatus(ParticipationStatus.LEFT_REJECTED);
            return eventUserRepository.save(eu);
        }

        if (eu.getParticipationStatus() == ParticipationStatus.ACCEPTED
                || eu.getParticipationStatus() == ParticipationStatus.PENDING) {
            eu.setParticipationStatus(ParticipationStatus.LEFT);
            return eventUserRepository.save(eu);
        }

        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Déjà quitté cet événement");
    }

    public List<EventUser> findByUserId(UUID userId) {
        return eventUserRepository.findAllByUserIdAndParticipationStatusNotIn(
                userId,
                List.of(ParticipationStatus.LEFT, ParticipationStatus.LEFT_REJECTED)
        );
    }

    public List<EventUser> findOrganizedByUserId(UUID userId) {
        return eventUserRepository.findAllByUserIdAndRole(userId, ParticipantRole.ORGANIZER);
    }

    @Transactional
    public void removeParticipant(UUID eventId, UUID userId, UUID organizerId) {
        EventUser organizer = eventUserRepository.findByEventIdAndUserId(eventId, organizerId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "Vous ne participez pas à cet événement"));

        if (organizer.getRole() != EventUser.ParticipantRole.ORGANIZER) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Seul l'organisateur peut retirer un participant");
        }

        EventUser target = eventUserRepository.findByEventIdAndUserId(eventId, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Participant introuvable"));

        if (target.getRole() == EventUser.ParticipantRole.ORGANIZER) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Impossible de retirer l'organisateur");
        }

        eventUserRepository.delete(target);
    }
}
