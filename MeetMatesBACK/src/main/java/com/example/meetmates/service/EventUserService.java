package com.example.meetmates.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.example.meetmates.exception.AlreadyParticipantException;
import com.example.meetmates.exception.EventNotFoundException;
import com.example.meetmates.exception.UserNotFoundException;
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

    // ------------------------------------------------------------
    // JOIN EVENT
    // ------------------------------------------------------------
    @Transactional
    public EventUser joinEvent(UUID eventId, UUID userId) {

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EventNotFoundException("Événement introuvable"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("Utilisateur introuvable"));

        // Vérifier si l'utilisateur participe déjà
        Optional<EventUser> existingOpt = eventUserRepository.findByEventIdAndUserId(eventId, userId);

        if (existingOpt.isPresent()) {
            EventUser existing = existingOpt.get();

            switch (existing.getParticipationStatus()) {

                case ACCEPTED ->
                    throw new AlreadyParticipantException("Vous participez déjà à cet événement."); // 409

                case PENDING ->
                    throw new AlreadyParticipantException("Votre demande est encore en attente."); // 409

                case REJECTED, LEFT_REJECTED ->
                    throw new ResponseStatusException(
                            HttpStatus.FORBIDDEN,
                            "Vous ne pouvez pas rejoindre cet événement car vous avez été retiré."
                    ); // 403

                case LEFT -> {
                    existing.setParticipationStatus(ParticipationStatus.PENDING);
                    existing.setJoinedAt(LocalDateTime.now());
                    return eventUserRepository.save(existing);
                }

                default ->
                    throw new ResponseStatusException(
                            HttpStatus.INTERNAL_SERVER_ERROR,
                            "Statut de participation invalide."
                    );
            }
        }

        // Vérifier si l'événement est plein
        if (event.getMaxParticipants() != null
                && event.getParticipants().size() >= event.getMaxParticipants()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "L'événement est complet.");
        }

        // Ajouter le participant
        EventUser eventUser = new EventUser();
        eventUser.setEvent(event);
        eventUser.setUser(user);
        eventUser.setUserEmail(user.getEmail());
        eventUser.setRole(ParticipantRole.PARTICIPANT);
        eventUser.setParticipationStatus(ParticipationStatus.PENDING);
        eventUser.setJoinedAt(LocalDateTime.now());

        return eventUserRepository.save(eventUser);
    }

    // ------------------------------------------------------------
    // ACCEPT PARTICIPANT
    // ------------------------------------------------------------
    public EventUser acceptParticipant(UUID eventUserId) {
        EventUser eu = eventUserRepository.findById(eventUserId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Participant introuvable"));

        eu.setParticipationStatus(ParticipationStatus.ACCEPTED);
        return eventUserRepository.save(eu);
    }

    // ------------------------------------------------------------
    // REJECT PARTICIPANT
    // ------------------------------------------------------------
    public EventUser rejectParticipant(UUID eventUserId) {
        EventUser eu = eventUserRepository.findById(eventUserId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Participant introuvable"));

        eu.setParticipationStatus(ParticipationStatus.REJECTED);
        return eventUserRepository.save(eu);
    }

    // ------------------------------------------------------------
    // LEAVE EVENT
    // ------------------------------------------------------------
    @Transactional
    public EventUser leaveEvent(UUID eventId, UUID userId) {
        EventUser eu = eventUserRepository.findByEventIdAndUserId(eventId, userId)
                .orElseThrow(()
                        -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Vous ne participez pas à cet événement.")
                );

        if (eu.getParticipationStatus() == ParticipationStatus.LEFT
                || eu.getParticipationStatus() == ParticipationStatus.LEFT_REJECTED) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Vous avez déjà quitté cet événement.");
        }

        if (eu.getParticipationStatus() == ParticipationStatus.REJECTED) {
            eu.setParticipationStatus(ParticipationStatus.LEFT_REJECTED);
        } else {
            eu.setParticipationStatus(ParticipationStatus.LEFT);
        }

        return eventUserRepository.save(eu);
    }

    // ------------------------------------------------------------
    // MY EVENTS
    // ------------------------------------------------------------
    public List<EventUser> findByUserId(UUID userId) {
        return eventUserRepository.findAllByUserIdAndParticipationStatusNotIn(
                userId,
                List.of(ParticipationStatus.LEFT, ParticipationStatus.LEFT_REJECTED)
        );
    }

    // ------------------------------------------------------------
    // ORGANIZED EVENTS
    // ------------------------------------------------------------
    public List<EventUser> findOrganizedByUserId(UUID userId) {
        return eventUserRepository.findAllByUserIdAndRole(userId, ParticipantRole.ORGANIZER);
    }

    // ------------------------------------------------------------
    // REMOVE PARTICIPANT (ORGANIZER ONLY)
    // ------------------------------------------------------------
    @Transactional
    public void removeParticipant(UUID eventId, UUID userId, UUID organizerId) {

        EventUser organizer = eventUserRepository.findByEventIdAndUserId(eventId, organizerId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "Accès refusé."));

        if (organizer.getRole() != ParticipantRole.ORGANIZER) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Seul l'organisateur peut retirer un participant.");
        }

        EventUser target = eventUserRepository.findByEventIdAndUserId(eventId, userId)
                .orElseThrow(()
                        -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Participant introuvable.")
                );

        if (target.getRole() == ParticipantRole.ORGANIZER) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Impossible de retirer l'organisateur."
            );
        }

        eventUserRepository.delete(target);
    }
}
