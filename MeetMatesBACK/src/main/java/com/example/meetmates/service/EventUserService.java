package com.example.meetmates.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.example.meetmates.dto.EventUserDto;
import com.example.meetmates.exception.AlreadyParticipantException;
import com.example.meetmates.exception.EventNotFoundException;
import com.example.meetmates.exception.UserNotFoundException;
import com.example.meetmates.mapper.EventMapper;
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
    private final EventMapper eventMapper;

    public EventUserService(
            EventRepository eventRepository,
            UserRepository userRepository,
            EventUserRepository eventUserRepository,
            EventMapper eventMapper
    ) {
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
        this.eventUserRepository = eventUserRepository;
        this.eventMapper = eventMapper;  
    }

    // * Permet à un utilisateur de rejoindre un événement
    @Transactional
    public EventUserDto joinEvent(UUID eventId, UUID userId) {

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EventNotFoundException("Événement introuvable"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("Utilisateur introuvable"));

        Optional<EventUser> existingOpt = eventUserRepository.findByEventIdAndUserId(eventId, userId);

        if (existingOpt.isPresent()) {
            EventUser existing = existingOpt.get();

            switch (existing.getParticipationStatus()) {

                case ACCEPTED ->
                    throw new AlreadyParticipantException("Vous participez déjà à cet événement.");

                case PENDING ->
                    throw new AlreadyParticipantException("Votre demande est encore en attente.");

                case REJECTED, LEFT_REJECTED ->
                    throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                            "Vous ne pouvez pas rejoindre cet événement car vous avez été retiré.");

                case LEFT -> {
                    existing.setParticipationStatus(ParticipationStatus.PENDING);
                    existing.setJoinedAt(LocalDateTime.now());
                    return eventMapper.EventUserDto(eventUserRepository.save(existing));
                }

                default ->
                    throw new ResponseStatusException(
                            HttpStatus.INTERNAL_SERVER_ERROR,
                            "Statut de participation invalide."
                    );
            }
        }

        if (event.getMaxParticipants() != null
                && event.getParticipants().size() >= event.getMaxParticipants()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "L'événement est complet.");
        }

        EventUser eventUser = new EventUser();
        eventUser.setEvent(event);
        eventUser.setUser(user);
        eventUser.setUserEmail(user.getEmail());
        eventUser.setRole(ParticipantRole.PARTICIPANT);
        eventUser.setParticipationStatus(ParticipationStatus.PENDING);
        eventUser.setJoinedAt(LocalDateTime.now());

        return eventMapper.EventUserDto(eventUserRepository.save(eventUser)); 
    }

    // * Accepte un participant en attente pour un événement
    public EventUserDto acceptParticipant(UUID eventUserId) {
        EventUser eu = eventUserRepository.findById(eventUserId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Participant introuvable"));

        eu.setParticipationStatus(ParticipationStatus.ACCEPTED);
        return eventMapper.EventUserDto(eventUserRepository.save(eu));
    }
    
    // * Rejette une demande de participation
    public EventUserDto rejectParticipant(UUID eventUserId) {
        EventUser eu = eventUserRepository.findById(eventUserId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Participant introuvable"));

        eu.setParticipationStatus(ParticipationStatus.REJECTED);
        return eventMapper.EventUserDto(eventUserRepository.save(eu));
    }

    // * Permet à un utilisateur de quitter un événement
    @Transactional
    public EventUserDto leaveEvent(UUID eventId, UUID userId) {
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

        return eventMapper.EventUserDto(eventUserRepository.save(eu));
    }

    // * Retourne tous les événements auxquels l'utilisateur participe
    public List<EventUserDto> findByUserId(UUID userId) {
        return eventUserRepository.findAllByUserIdAndParticipationStatusNotIn(
                userId,
                List.of(ParticipationStatus.LEFT, ParticipationStatus.LEFT_REJECTED)
        )
                .stream()
                .map(eventMapper::EventUserDto)
                .toList();
    }

    // * Retourne les événements dont l'utilisateur est organisateur
    public List<EventUserDto> findOrganizedByUserId(UUID userId) {
        return eventUserRepository.findAllByUserIdAndRole(userId, ParticipantRole.ORGANIZER)
                .stream()
                .map(eventMapper::EventUserDto)
                .toList();
    }

    // * Permet à l'organisateur de retirer un participant d’un événement
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
