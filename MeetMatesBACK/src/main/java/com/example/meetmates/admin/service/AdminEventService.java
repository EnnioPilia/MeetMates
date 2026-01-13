package com.example.meetmates.admin.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.meetmates.common.exception.ApiException;
import com.example.meetmates.common.exception.ErrorCode;
import com.example.meetmates.event.dto.EventResponseDto;
import com.example.meetmates.event.mapper.EventMapper;
import com.example.meetmates.event.model.Event;
import com.example.meetmates.event.repository.EventRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Service métier dédié à l’administration des événements.
 *
 * Fournit les fonctionnalités nécessaires aux administrateurs pour : -
 * consulter tous les événements (actifs ou supprimés logiquement) - effectuer
 * une suppression logique (soft delete) - restaurer un événement supprimé -
 * supprimer définitivement un événement (hard delete)
 *
 * Toutes les opérations sont exécutées dans un contexte transactionnel. Les
 * règles de sécurité sont appliquées au niveau du contrôleur.
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class AdminEventService {

    private final EventRepository eventRepository;
    private final EventMapper eventMapper;

    /**
     * Récupère l’ensemble des événements, y compris ceux supprimés logiquement.
     *
     * @return liste complète des événements
     */
    @Transactional(readOnly = true)
    public List<EventResponseDto> getAllEvents() {
        return eventRepository.findAll()
                .stream()
                .map(eventMapper::toResponse)
                .toList();
    }

    /**
     * Récupère uniquement les événements actifs.
     *     *
     * @return liste des événements non supprimés
     */
    @Transactional(readOnly = true)
    public List<EventResponseDto> getAllActiveEvents() {
        return eventRepository.findByDeletedAtIsNull()
                .stream()
                .map(eventMapper::toResponse)
                .toList();
    }
    /**
     * Supprime un événement de manière logique.
     *
     * @param eventId identifiant UUID de l’événement
     */
    public void softDeleteEvent(UUID eventId) {
        Event event = getEvent(eventId);

        if (event.getDeletedAt() != null) {
            return;
        }

        event.setDeletedAt(LocalDateTime.now());

        log.warn("ADMIN soft-deleted event {}", eventId);
    }

    /**
     * Restaure un événement précédemment supprimé logiquement.
     *
     * @param eventId identifiant UUID de l’événement
     */
    public void restoreEvent(UUID eventId) {
        Event event = getEvent(eventId);

        event.setDeletedAt(null);

        log.info("ADMIN restored event {}", eventId);
    }

    /**
     * Supprime définitivement un événement (hard delete).
     *
     * @param eventId identifiant UUID de l’événement
     */
    public void hardDeleteEvent(UUID eventId) {
        Event event = getEvent(eventId);

        eventRepository.delete(event);

        log.warn("ADMIN hard-deleted event {}", eventId);
    }

    /**
     * Récupère un événement à partir de son identifiant.
     *
     * Lance une exception métier si l’événement n’existe pas.
     *
     * @param eventId identifiant UUID de l’événement
     * @return événement correspondant
     * @throws ApiException si l’événement est introuvable
     */
    private Event getEvent(UUID eventId) {
        return eventRepository.findById(eventId)
                .orElseThrow(() -> new ApiException(ErrorCode.EVENT_NOT_FOUND));
    }
}
