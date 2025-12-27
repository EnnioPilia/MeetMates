package com.example.meetmates.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.meetmates.dto.EventDetailsDto;
import com.example.meetmates.dto.EventRequestDto;
import com.example.meetmates.dto.EventResponseDto;
import com.example.meetmates.dto.EventUserDto;
import com.example.meetmates.exception.ApiException;
import com.example.meetmates.exception.ErrorCode;
import com.example.meetmates.mapper.AddressMapper;
import com.example.meetmates.mapper.EventMapper;
import com.example.meetmates.model.Address;
import com.example.meetmates.model.Event;
import com.example.meetmates.model.EventUser;
import com.example.meetmates.model.EventUser.ParticipantRole;
import com.example.meetmates.model.EventUser.ParticipationStatus;
import com.example.meetmates.model.User;
import com.example.meetmates.repository.ActivityRepository;
import com.example.meetmates.repository.EventRepository;
import com.example.meetmates.repository.EventUserRepository;
import com.example.meetmates.repository.UserRepository;

import lombok.extern.slf4j.Slf4j;

/**
 * Service de gestion des événements. Fournit les fonctionnalités de création,
 * mise à jour, suppression, recherche et récupération des événements. Gère
 * également l'ajout de participants et la récupération des détails liés aux
 * événements.
 */
@Slf4j
@Service
public class EventService {

    private final EventRepository eventRepository;
    private final ActivityRepository activityRepository;
    private final UserRepository userRepository;
    private final EventUserRepository eventUserRepository;
    private final EventMapper eventMapper;

    public EventService(EventRepository eventRepository,
            ActivityRepository activityRepository,
            UserRepository userRepository,
            EventUserRepository eventUserRepository,
            EventMapper eventMapper) {
        this.eventRepository = eventRepository;
        this.activityRepository = activityRepository;
        this.userRepository = userRepository;
        this.eventUserRepository = eventUserRepository;
        this.eventMapper = eventMapper;
    }

    /**
     * Crée un nouvel événement et l'associe à l'utilisateur authentifié en tant
     * qu'organisateur.
     *
     * @param req DTO contenant les informations de l'événement
     * @return DTO de réponse de l'événement créé
     * @throws ApiException si l'activité liée n'existe pas
     */
    @Transactional
    public EventResponseDto createEvent(EventRequestDto req) {
        User organizer = getAuthenticatedUser();
        log.info("Utilisateur {} crée un événement '{}'", organizer.getEmail(), req.getTitle());

        var activity = activityRepository.findById(req.getActivityId())
                .orElseThrow(() -> new ApiException(ErrorCode.ACTIVITY_NOT_FOUND));

        Address address = AddressMapper.toEntity(req.getAddress());

        Event event = new Event();
        event.setTitle(req.getTitle());
        event.setDescription(req.getDescription());
        event.setEventDate(req.getEventDate());
        event.setStartTime(req.getStartTime());
        event.setEndTime(req.getEndTime());
        event.setMaxParticipants(req.getMaxParticipants());
        event.setStatus(req.getStatus());
        event.setMaterial(req.getMaterial());
        event.setLevel(req.getLevel());
        event.setActivity(activity);
        event.setAddress(address);

        Event saved = eventRepository.save(event);

        addOrganizer(saved, organizer);

        return eventMapper.toResponse(saved);
    }

    /**
     * Récupère la liste de tous les événements avec leurs détails.
     *
     * @return liste des DTO d'événements
     */
    @Transactional(readOnly = true)
    public List<EventResponseDto> findAllResponses() {
        return eventRepository.findAllActiveWithDetails()
                .stream()
                .map(eventMapper::toResponse)
                .toList();
    }

    /**
     * Récupère les détails complets d'un événement par son identifiant.
     *
     * Inclut : -Les informations générales de l'événement -L'adresse associée<
     * -Le nom de l'organisateur -Les listes de participants par statut -Le
     * statut de participation de l'utilisateur connecté
     *
     * @param eventId ID de l'événement
     * @return DTO détaillé de l'événement
     * @throws ApiException si l'événement n'existe pas
     */
    @Transactional(readOnly = true)
    public EventDetailsDto findEventDetailsById(UUID eventId) {
        Event event = eventRepository.findByIdWithAllRelations(eventId)
                .filter(e -> e.getDeletedAt() == null)
                .orElseThrow(() -> new ApiException(ErrorCode.EVENT_NOT_FOUND));

        User user = getAuthenticatedUserOrNull();

        String participationStatus = event.getParticipants().stream()
                .filter(p -> user != null && p.getUser().getId().equals(user.getId()))
                .map(p -> p.getParticipationStatus().name())
                .findFirst()
                .orElse("NOT_PARTICIPATING");

        String organizerName = event.getParticipants().stream()
                .filter(p -> p.getRole() == ParticipantRole.ORGANIZER)
                .map(p -> p.getUser().getFirstName() + " " + p.getUser().getLastName())
                .findFirst()
                .orElse("Inconnu");

        List<EventUserDto> accepted = event.getParticipants().stream()
                .filter(p -> p.getParticipationStatus() == ParticipationStatus.ACCEPTED)
                .map(eventMapper::EventUserDto)
                .toList();

        List<EventUserDto> pending = event.getParticipants().stream()
                .filter(p -> p.getParticipationStatus() == ParticipationStatus.PENDING)
                .map(eventMapper::EventUserDto)
                .toList();

        List<EventUserDto> rejected = event.getParticipants().stream()
                .filter(p -> p.getParticipationStatus() == ParticipationStatus.REJECTED)
                .map(eventMapper::EventUserDto)
                .toList();

        return new EventDetailsDto(
                event.getId(),
                event.getTitle(),
                event.getDescription(),
                event.getEventDate().toString(),
                event.getStartTime().toString(),
                event.getEndTime().toString(),
                event.getAddress() != null ? AddressMapper.toDto(event.getAddress()) : null,
                event.getActivity() != null ? event.getActivity().getName() : null,
                organizerName,
                String.valueOf(event.getLevel()),
                String.valueOf(event.getMaterial()),
                String.valueOf(event.getStatus()),
                event.getMaxParticipants(),
                participationStatus,
                accepted,
                pending,
                rejected
        );
    }

    /**
     * Récupère les événements associés à une activité donnée.
     *
     * @param activityId ID de l'activité
     * @return liste des DTO d'événements
     * @throws ApiException si l'activité n'existe pas
     */
    @Transactional(readOnly = true)
    public List<EventResponseDto> getEventResponsesByActivity(UUID activityId) {

        activityRepository.findById(activityId)
                .orElseThrow(() -> new ApiException(ErrorCode.ACTIVITY_NOT_FOUND));

        log.info("Récupération des événements pour l'activité {}", activityId);
        return eventRepository.findActiveByActivityIdWithDetails(activityId)
                .stream()
                .map(eventMapper::toResponse)
                .toList();
    }

    /**
     * Supprime un événement par son ID.
     *
     * @param eventId ID de l'événement
     * @throws ApiException si l'événement n'existe pas
     */
    @Transactional
    public void deleteEvent(UUID eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ApiException(ErrorCode.EVENT_NOT_FOUND));

        if (event.getDeletedAt() != null) {
            throw new ApiException(ErrorCode.EVENT_DELETED);
        }

        User currentUser = getAuthenticatedUser();

        boolean isOrganizer = event.getParticipants().stream()
                .anyMatch(p
                        -> p.getRole() == ParticipantRole.ORGANIZER
                && p.getUser().getId().equals(currentUser.getId())
                );

        if (!isOrganizer) {
            throw new ApiException(ErrorCode.EVENT_FORBIDDEN);
        }

        // 🔥 SOFT DELETE UNIQUEMENT
        event.setDeletedAt(LocalDateTime.now());

        eventRepository.save(event);

        log.info("Organisateur {} a soft-delete l'événement {}", currentUser.getEmail(), eventId);
    }

    /**
     * Met à jour un événement existant avec les informations fournies.
     *
     * Si une adresse est présente dans la requête, celle-ci est mise à jour ou
     * créée si l'événement n'en possédait pas auparavant.
     *
     * Si un identifiant d'activité est fourni, l'activité associée à
     * l'événement est également mise à jour.
     *
     * @param eventId ID de l'événement
     * @param updatedEvent DTO contenant les nouvelles informations
     * @return DTO de réponse de l'événement mis à jour
     * @throws ApiException si l'événement ou l'activité associée n'existe pas
     */
    @Transactional
    public EventResponseDto updateEvent(UUID eventId, EventRequestDto updatedEvent) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ApiException(ErrorCode.EVENT_NOT_FOUND));

        log.info("Utilisateur {} met à jour l'événement {}", getAuthenticatedUser().getEmail(), eventId);

        event.setTitle(updatedEvent.getTitle());
        event.setDescription(updatedEvent.getDescription());
        event.setEventDate(updatedEvent.getEventDate());
        event.setStartTime(updatedEvent.getStartTime());
        event.setEndTime(updatedEvent.getEndTime());
        event.setMaxParticipants(updatedEvent.getMaxParticipants());
        event.setStatus(updatedEvent.getStatus());
        event.setMaterial(updatedEvent.getMaterial());
        event.setLevel(updatedEvent.getLevel());

        if (updatedEvent.getAddress() != null) {
            Address addr = event.getAddress() != null
                    ? event.getAddress()
                    : new Address();

            addr.setStreet(updatedEvent.getAddress().getStreet());
            addr.setCity(updatedEvent.getAddress().getCity());
            addr.setPostalCode(updatedEvent.getAddress().getPostalCode());

            event.setAddress(addr);
        }

        if (updatedEvent.getActivityId() != null) {
            var activity = activityRepository.findById(updatedEvent.getActivityId())
                    .orElseThrow(() -> new ApiException(ErrorCode.ACTIVITY_NOT_FOUND));
            event.setActivity(activity);
        }

        return eventMapper.toResponse(eventRepository.save(event));
    }

    /**
     * Recherche des événements contenant le texte fourni.
     *
     * @param query texte de recherche
     * @return liste des DTO d'événements correspondant à la recherche
     */
    @Transactional(readOnly = true)
    public List<EventResponseDto> searchEvents(String query) {
        if (query == null || query.isBlank()) {
            return List.of();
        }

        log.info("Recherche d'événements avec le texte '{}'", query.trim().toLowerCase());
        return eventRepository.searchActiveEvents(query.trim().toLowerCase())
                .stream()
                .map(eventMapper::toResponse)
                .toList();
    }

    /**
     * Ajoute l'organisateur à un événement.
     *
     * @param event événement
     * @param organizer utilisateur organisateur
     */
    private void addOrganizer(Event event, User organizer) {
        EventUser eu = new EventUser();
        eu.setEvent(event);
        eu.setUser(organizer);
        eu.setUserEmail(organizer.getEmail());
        eu.setRole(ParticipantRole.ORGANIZER);
        eu.setParticipationStatus(ParticipationStatus.ACCEPTED);

        eventUserRepository.save(eu);

        if (event.getParticipants() == null) {
            event.setParticipants(new ArrayList<>());
        }
        event.getParticipants().add(eu);
    }

    /**
     * Récupère l'utilisateur actuellement authentifié.
     *
     * @return utilisateur authentifié
     * @throws ApiException si aucun utilisateur n'est authentifié
     */
    private User getAuthenticatedUser() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new ApiException(ErrorCode.USER_NOT_FOUND);
        }

        return userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new ApiException(ErrorCode.USER_NOT_FOUND));
    }

    /**
     * Récupère l'utilisateur authentifié ou retourne null si non authentifié.
     *
     * @return utilisateur authentifié ou null
     */
    private User getAuthenticatedUserOrNull() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return null;
        }
        return userRepository.findByEmail(auth.getName()).orElse(null);
    }

}
