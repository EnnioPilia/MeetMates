package com.example.meetmates.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.meetmates.dto.EventUserDto;
import com.example.meetmates.exception.ApiException;
import com.example.meetmates.exception.ErrorCode;
import com.example.meetmates.mapper.EventMapper;
import com.example.meetmates.model.Event;
import com.example.meetmates.model.EventUser;
import com.example.meetmates.model.EventUser.ParticipantRole;
import com.example.meetmates.model.EventUser.ParticipationStatus;
import com.example.meetmates.model.User;
import com.example.meetmates.repository.EventRepository;
import com.example.meetmates.repository.EventUserRepository;
import com.example.meetmates.repository.UserRepository;

import lombok.extern.slf4j.Slf4j;

/**
 * Service de gestion des participants aux événements.
 * Fournit les fonctionnalités pour rejoindre, quitter, accepter, rejeter et gérer les participants.
 */
@Slf4j
@Service
public class EventUserService {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final EventUserRepository eventUserRepository;
    private final EventMapper eventMapper;

    public EventUserService(EventRepository eventRepository,
                            UserRepository userRepository,
                            EventUserRepository eventUserRepository,
                            EventMapper eventMapper) {
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
        this.eventUserRepository = eventUserRepository;
        this.eventMapper = eventMapper;
    }

    /**
     * Permet à un utilisateur de rejoindre un événement.
     * Gère les différents statuts existants et le nombre maximum de participants.
     *
     * @param eventId ID de l'événement
     * @param userId  ID de l'utilisateur
     * @return DTO représentant la participation de l'utilisateur
     * @throws ApiException en cas de statut incompatible, d'événement plein ou introuvable
     */
    @Transactional
    public EventUserDto joinEvent(UUID eventId, UUID userId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ApiException(ErrorCode.EVENT_NOT_FOUND));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ApiException(ErrorCode.USER_NOT_FOUND));

        EventUser existing = eventUserRepository.findByEventIdAndUserId(eventId, userId).orElse(null);

        if (existing != null) {
            switch (existing.getParticipationStatus()) {
                case ACCEPTED ->
                    throw new ApiException(ErrorCode.EVENT_ALREADY_PARTICIPANT);
                case PENDING ->
                    throw new ApiException(ErrorCode.EVENT_PENDING_ALREADY);
                case REJECTED, LEFT_REJECTED ->
                    throw new ApiException(ErrorCode.EVENT_REQUEST_REJECTED);
                case LEFT -> {
                    existing.setParticipationStatus(ParticipationStatus.PENDING);
                    existing.setJoinedAt(LocalDateTime.now());
                    EventUser saved = eventUserRepository.save(existing);

                    log.info("Utilisateur {} rejoint l'événement {} à nouveau (status PENDING)", userId, eventId);
                    return eventMapper.EventUserDto(saved);
                }
                default ->
                    throw new ApiException(ErrorCode.EVENT_INVALID_STATUS);
            }
        }

        if (event.getMaxParticipants() != null
                && event.getParticipants().size() >= event.getMaxParticipants()) {
            throw new ApiException(ErrorCode.EVENT_FULL);
        }

        EventUser eu = new EventUser();
        eu.setEvent(event);
        eu.setUser(user);
        eu.setUserEmail(user.getEmail());
        eu.setRole(ParticipantRole.PARTICIPANT);
        eu.setParticipationStatus(ParticipationStatus.PENDING);
        eu.setJoinedAt(LocalDateTime.now());

        return eventMapper.EventUserDto(eventUserRepository.save(eu));
    }

    /**
     * Permet à un utilisateur de quitter un événement.
     * Met à jour le statut de participation en conséquence.
     *
     * @param eventId ID de l'événement
     * @param userId  ID de l'utilisateur
     * @return DTO représentant la participation mise à jour
     * @throws ApiException si l'utilisateur n'a pas le droit de quitter l'événement
     */
    @Transactional
    public EventUserDto leaveEvent(UUID eventId, UUID userId) {
        EventUser eu = eventUserRepository.findByEventIdAndUserId(eventId, userId)
                .orElseThrow(() -> new ApiException(ErrorCode.EVENT_FORBIDDEN));

        if (eu.getParticipationStatus() == ParticipationStatus.LEFT
                || eu.getParticipationStatus() == ParticipationStatus.LEFT_REJECTED) {
            throw new ApiException(ErrorCode.EVENT_FORBIDDEN);
        }

        if (eu.getParticipationStatus() == ParticipationStatus.REJECTED) {
            eu.setParticipationStatus(ParticipationStatus.LEFT_REJECTED);
        } else {
            eu.setParticipationStatus(ParticipationStatus.LEFT);
        }

        log.info("Utilisateur {} a demandé à rejoindre l'événement {} (status PENDING)", userId, eventId);
        return eventMapper.EventUserDto(eventUserRepository.save(eu));
    }

    /**
     * Accepte la participation d'un utilisateur à un événement.
     *
     * @param eventUserId ID de la participation
     * @return DTO de la participation acceptée
     * @throws ApiException si la participation n'existe pas
     */
    public EventUserDto acceptParticipant(UUID eventUserId) {
        EventUser eu = eventUserRepository.findById(eventUserId)
                .orElseThrow(() -> new ApiException(ErrorCode.PARTICIPANT_NOT_FOUND));

        eu.setParticipationStatus(ParticipationStatus.ACCEPTED);

        log.info("Participation {} acceptée pour l'événement {}", eventUserId, eu.getEvent().getId());
        return eventMapper.EventUserDto(eventUserRepository.save(eu));
    }

    /**
     * Rejette la participation d'un utilisateur à un événement.
     *
     * @param eventUserId ID de la participation
     * @return DTO de la participation rejetée
     * @throws ApiException si la participation n'existe pas
     */
    public EventUserDto rejectParticipant(UUID eventUserId) {
        EventUser eu = eventUserRepository.findById(eventUserId)
                .orElseThrow(() -> new ApiException(ErrorCode.PARTICIPANT_NOT_FOUND));

        eu.setParticipationStatus(ParticipationStatus.REJECTED);

        log.info("Participation {} rejetée pour l'événement {}", eventUserId, eu.getEvent().getId());
        return eventMapper.EventUserDto(eventUserRepository.save(eu));
    }

    /**
     * Récupère toutes les participations d'un utilisateur qui sont actives.
     *
     * @param userId ID de l'utilisateur
     * @return liste des DTO de participations
     */
    public List<EventUserDto> findByUserId(UUID userId) {
        log.info("Récupération des participations actives de l'utilisateur {}", userId);
        return eventUserRepository.findAllByUserIdAndRoleAndParticipationStatusNotIn(
                        userId,
                        ParticipantRole.PARTICIPANT,
                        List.of(ParticipationStatus.LEFT, ParticipationStatus.LEFT_REJECTED))
                .stream()
                .map(eventMapper::EventUserDto)
                .toList();
    }

    /**
     * Récupère tous les événements organisés par un utilisateur.
     *
     * @param userId ID de l'utilisateur
     * @return liste des DTO des participations en tant qu'organisateur
     */
    public List<EventUserDto> findOrganizedByUserId(UUID userId) {
        log.info("Récupération des événements organisés par l'utilisateur {}", userId);
        return eventUserRepository.findAllByUserIdAndRole(userId, ParticipantRole.ORGANIZER)
                .stream()
                .map(eventMapper::EventUserDto)
                .toList();
    }

    /**
     * Supprime un participant d'un événement.
     * Seul l'organisateur peut effectuer cette action.
     *
     * @param eventId     ID de l'événement
     * @param userId      ID de l'utilisateur à retirer
     * @param organizerId ID de l'organisateur effectuant l'action
     * @throws ApiException si les droits sont insuffisants ou si la participation n'existe pas
     */
    @Transactional
    public void removeParticipant(UUID eventId, UUID userId, UUID organizerId) {
        EventUser organizer = eventUserRepository.findByEventIdAndUserId(eventId, organizerId)
                .orElseThrow(() -> new ApiException(ErrorCode.EVENT_FORBIDDEN));

        if (organizer.getRole() != ParticipantRole.ORGANIZER) {
            throw new ApiException(ErrorCode.EVENT_FORBIDDEN);
        }

        EventUser target = eventUserRepository.findByEventIdAndUserId(eventId, userId)
                .orElseThrow(() -> new ApiException(ErrorCode.PARTICIPANT_NOT_FOUND));

        if (target.getRole() == ParticipantRole.ORGANIZER) {
            throw new ApiException(ErrorCode.EVENT_ORGANIZER_CANNOT_BE_REMOVED);
        }

        eventUserRepository.delete(target);
        log.info("Organisateur {} a retiré l'utilisateur {} de l'événement {}", organizerId, userId, eventId);
    }
}
