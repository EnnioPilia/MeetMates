package com.example.meetmates.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.meetmates.dto.ApiResponse;
import com.example.meetmates.dto.EventDetailsDto;
import com.example.meetmates.dto.EventRequestDto;
import com.example.meetmates.dto.EventResponseDto;
import com.example.meetmates.service.EventService;
import com.example.meetmates.service.MessageService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Contrôleur REST dédié à la gestion des événements.
 *
 * Fournit plusieurs endpoints pour :
 *  - créer, consulter, modifier et supprimer des événements
 *  - récupérer les détails d’un événement
 *  - filtrer par activité
 *  - effectuer des recherches textuelles
 *
 * Utilise ApiResponse pour garantir une structure uniforme des retours.
 * Les messages utilisateurs sont centralisés via MessageService, 
 * lequel lit les codes dans le fichier messages.properties (i18n).
 */
@RestController
@RequestMapping("/event")
@RequiredArgsConstructor
@Slf4j
public class EventController {

    private final EventService eventService;
    private final MessageService messageService;

    /**
     * Crée un nouvel événement.
     *
     * Accessible uniquement aux utilisateurs authentifiés.
     *
     * @param request données nécessaires à la création de l’événement
     * @return l’événement créé et un message de confirmation
     */
    @PreAuthorize("isAuthenticated()")
    @PostMapping
    public ResponseEntity<ApiResponse<EventResponseDto>> create(@RequestBody EventRequestDto request) {
        EventResponseDto dto = eventService.createEvent(request);
        log.info("Événement créé, id={}");

        String message = messageService.get("EVENT_CREATE_SUCCESS");
        return ResponseEntity.ok(new ApiResponse<>(message, dto));
    }

    /**
     * Récupère la liste complète des événements disponibles.
     *
     * @return liste des événements visibles publiquement
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<EventResponseDto>>> findAll() {
        List<EventResponseDto> dtos = eventService.findAllResponses();
        log.info("Liste récupérée, {} événements", dtos.size());

        String message = messageService.get("EVENT_LIST_SUCCESS");
        return ResponseEntity.ok(new ApiResponse<>(message, dtos));
    }

    /**
     * Récupère les détails complets d’un événement (adresse, activité, organisateur…).
     *
     * @param eventId identifiant UUID de l’événement recherché
     * @return détails de l’événement
     */
    @GetMapping("/{eventId}")
    public ResponseEntity<ApiResponse<EventDetailsDto>> findById(@PathVariable UUID eventId) {
        EventDetailsDto dto = eventService.findEventDetailsById(eventId);
        log.info("Détails récupérés, id={}", eventId);

        String message = messageService.get("EVENT_GET_SUCCESS");
        return ResponseEntity.ok(new ApiResponse<>(message, dto));
    }

    /**
     * Récupère les événements associés à une activité spécifique.
     *
     * @param activityId identifiant de l’activité
     * @return liste d’événements liés à l’activité donnée
     */
    @GetMapping("/activity/{activityId}")
    public ResponseEntity<ApiResponse<List<EventResponseDto>>> findByActivity(@PathVariable UUID activityId) {
        List<EventResponseDto> dtos = eventService.getEventResponsesByActivity(activityId);
        log.info("Evénements récupérés pour activité id={}", dtos.size(), activityId);

        String message = messageService.get("EVENT_BY_ACTIVITY_SUCCESS");
        return ResponseEntity.ok(new ApiResponse<>(message, dtos));
    }

    /**
     * Met à jour un événement existant.
     * Sécurisé par une règle custom : seul l'organisateur peut modifier l’événement.
     *
     * @param eventId identifiant de l’événement
     * @param request nouvelles données de l’événement
     * @return événement mis à jour
     */
    @PreAuthorize("@eventSecurity.isOrganizer(#eventId)")
    @PutMapping("/{eventId}")
    public ResponseEntity<ApiResponse<EventResponseDto>> update(
            @PathVariable UUID eventId,
            @RequestBody EventRequestDto request
    ) {
        EventResponseDto dto = eventService.updateEvent(eventId, request);
        log.info("Événement mis à jour, id={}", eventId);

        String message = messageService.get("EVENT_UPDATE_SUCCESS");
        return ResponseEntity.ok(new ApiResponse<>(message, dto));
    }

    /**
     * Supprime un événement.
     * Sécurisé par une règle custom : seul l'organisateur peut supprimer l’événement.
     *
     * @param eventId identifiant de l’événement
     * @return message de confirmation
     */
    @PreAuthorize("@eventSecurity.isOrganizer(#eventId)")
    @DeleteMapping("/{eventId}")
    public ResponseEntity<ApiResponse<Void>> deleteEvent(@PathVariable UUID eventId) {
        eventService.deleteEvent(eventId);
        log.info("Événement supprimé, id={}", eventId);

        String message = messageService.get("EVENT_DELETE_SUCCESS");
        return ResponseEntity.ok(new ApiResponse<>(message, null));
    }

    /**
     * Recherche des événements selon un mot-clé (titre, description, activité, etc.).
     *
     * @param query texte recherché
     * @return liste des événements correspondant aux critères
     */
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<EventResponseDto>>> search(@RequestParam String query) {
        List<EventResponseDto> dtos = eventService.searchEvents(query);
        log.info("Recherche effectuée, {} résultats trouvés", dtos.size());

        String message = messageService.get("EVENT_SEARCH_SUCCESS");
        return ResponseEntity.ok(new ApiResponse<>(message, dtos));
    }
}
