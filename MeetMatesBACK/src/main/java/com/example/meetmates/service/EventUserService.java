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
 * Service de gestion des participations aux événements.
 *
 * Ce service encapsule l’ensemble des règles métier liées à la participation
 * des utilisateurs à un événement : - demande de participation - acceptation /
 * rejet par l’organisateur - départ volontaire d’un participant - suppression
 * forcée d’un participant par l’organisateur
 *
 * Les transitions de statuts sont strictement contrôlées afin de garantir la
 * cohérence métier (PENDING → ACCEPTED / REJECTED, LEFT, etc.).
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
     * Permet à un utilisateur de demander à rejoindre un événement.
     *
     * Règles métier : - si l'utilisateur est déjà ACCEPTED → refus - si la
     * participation est déjà PENDING → refus - si la participation a été
     * REJECTED ou LEFT_REJECTED → refus - si l'utilisateur avait quitté
     * l'événement (LEFT) → nouvelle demande autorisée (PENDING) - si le nombre
     * maximal de participants est atteint → refus
     *
     * @param eventId identifiant de l'événement
     * @param userId identifiant de l'utilisateur
     * @return DTO représentant la participation créée ou mise à jour
     *
     * @throws ApiException si : - l'événement n'existe pas - l'utilisateur
     * n'existe pas - l'événement est complet - le statut de participation
     * existant est incompatible
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
     *
     * Règles métier : - un utilisateur ne peut pas quitter un événement s'il
     * l'a déjà quitté - si la participation était REJECTED → passage à
     * LEFT_REJECTED - sinon → passage à LEFT
     *
     * @param eventId identifiant de l'événement
     * @param userId identifiant de l'utilisateur
     * @return DTO représentant la participation mise à jour
     *
     * @throws ApiException si la participation n'existe pas ou si l'utilisateur
     * n'est pas autorisé à quitter l'événement
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
     * Accepte la demande de participation d'un utilisateur à un événement.
     *
     * Cette action est réservée à l'organisateur de l'événement. La
     * participation passe de PENDING à ACCEPTED.
     *
     * @param eventUserId identifiant de la participation
     * @return DTO de la participation acceptée
     *
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
     * Rejette la demande de participation d'un utilisateur à un événement.
     *
     * La participation passe à l'état REJECTED et ne peut plus être acceptée
     * ultérieurement.
     *
     * @param eventUserId identifiant de la participation
     * @return DTO de la participation rejetée
     *
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
        return eventUserRepository.findActiveByUserIdAndRole(userId, ParticipantRole.ORGANIZER)
                .stream()
                .map(eventMapper::EventUserDto)
                .toList();

    }

    /**
     * Retire un participant d'un événement.
     *
     * Règles métier : - seule une participation avec le rôle ORGANIZER peut
     * effectuer cette action - un organisateur ne peut pas se retirer lui-même
     *
     * @param eventId identifiant de l'événement
     * @param userId identifiant de l'utilisateur à retirer
     * @param organizerId identifiant de l'organisateur effectuant l'action
     *
     * @throws ApiException si : - l'organisateur n'a pas les droits requis - la
     * participation ciblée n'existe pas - l'utilisateur à retirer est
     * organisateur
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
