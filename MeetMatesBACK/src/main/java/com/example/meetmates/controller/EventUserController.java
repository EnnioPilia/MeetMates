package com.example.meetmates.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.meetmates.dto.ApiResponse;
import com.example.meetmates.dto.EventUserDto;
import com.example.meetmates.exception.ApiException;
import com.example.meetmates.exception.ErrorCode;
import com.example.meetmates.model.User;
import com.example.meetmates.repository.UserRepository;
import com.example.meetmates.service.EventUserService;
import com.example.meetmates.service.MessageService;

import lombok.extern.slf4j.Slf4j;

/**
 * Contrôleur gérant l’inscription, la participation et la gestion
 * des utilisateurs dans les événements (EventUser).
 *
 * Fournit plusieurs endpoints pour :
 *  - rejoindre / quitter un événement
 *  - accepter / refuser un participant (organisateur)
 *  - consulter les événements auxquels un utilisateur participe
 *  - consulter les événements qu’un utilisateur organise
 *  - retirer un participant d’un événement
 *
 * Utilise ApiResponse pour garantir une structure uniforme des retours.
 * Les messages utilisateurs sont centralisés via MessageService, 
 * lequel lit les codes dans le fichier messages.properties (i18n).
 */
@Slf4j
@RestController
@RequestMapping("/event-user")
public class EventUserController {

    private final EventUserService eventUserService;
    private final UserRepository userRepository;
    private final MessageService messageService;

    /**
     * Injection des services nécessaires.
     *
     * @param eventUserService service gérant la relation utilisateur–événement
     * @param userRepository accès aux utilisateurs pour vérifier l'identité
     * @param messageService gestionnaire des messages (messages.properties)
     */
    public EventUserController(EventUserService eventUserService,
            UserRepository userRepository,
            MessageService messageService) {
        this.eventUserService = eventUserService;
        this.userRepository = userRepository;
        this.messageService = messageService;
    }

    /**
     * Récupère l’utilisateur authentifié à partir du contexte Spring Security.
     * 
     * @param authentication contexte d’authentification
     * @return l’utilisateur authentifié
     * @throws ApiException si aucun utilisateur n'est connecté ou introuvable
     */
    private User getAuthenticatedUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ApiException(ErrorCode.AUTH_UNAUTHORIZED);
        }

        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ApiException(ErrorCode.USER_NOT_FOUND));
    }

    /**
     * Permet à un utilisateur connecté de rejoindre un événement.
     *
     * @param eventId identifiant de l’événement à rejoindre
     * @param authentication contexte d’authentification
     * @return les informations de participation
     */
    @PreAuthorize("isAuthenticated()")
    @PostMapping("/{eventId}/join")
    public ResponseEntity<ApiResponse<EventUserDto>> joinEvent(@PathVariable UUID eventId, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        EventUserDto dto = eventUserService.joinEvent(eventId, user.getId());

        log.info("L’utilisateur a rejoint l’événement, eventId={}", eventId);
        String message = messageService.get("EVENT.JOIN.SUCCESS");
        return ResponseEntity.ok(new ApiResponse<>(message, dto));
    }

    /**
     * Permet à un utilisateur de quitter un événement auquel il participe.
     *
     * @param eventId identifiant de l’événement
     * @param authentication contexte utilisateur
     * @return les informations de participation supprimée
     */
    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/{eventId}/leave")
    public ResponseEntity<ApiResponse<EventUserDto>> leaveEvent(@PathVariable UUID eventId, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        EventUserDto dto = eventUserService.leaveEvent(eventId, user.getId());

        log.info("L’utilisateur a quitté l’événement, eventId={}", eventId);
        String message = messageService.get("EVENT.LEAVE.SUCCESS");
        return ResponseEntity.ok(new ApiResponse<>(message, dto));
    }

    /**
     * Accepte un participant en attente.
     * Sécurisé par une règle custom : seul l'organisateur peut accepter un particpant.
     *
     * @param eventUserId identifiant de la relation utilisateur–événement
     * @return participant accepté
     */
    @PreAuthorize("@eventSecurity.isOrganizerByEventUserId(#eventUserId)")
    @PutMapping("/{eventUserId}/accept")
    public ResponseEntity<ApiResponse<EventUserDto>> acceptParticipant(@PathVariable UUID eventUserId) {
        EventUserDto dto = eventUserService.acceptParticipant(eventUserId);

        log.info("Participant accepté, eventUserId={}", eventUserId);
        String message = messageService.get("EVENT.PARTICIPANT.ACCEPT.SUCCESS");
        return ResponseEntity.ok(new ApiResponse<>(message, dto));
    }

    /**
     * Refuse un participant en attente.
     * Sécurisé par une règle custom : seul l'organisateur peut refuser un particpant.
     *
     * @param eventUserId identifiant de participation
     * @return participant refusé
     */
    @PreAuthorize("@eventSecurity.isOrganizerByEventUserId(#eventUserId)")
    @PutMapping("/{eventUserId}/reject")
    public ResponseEntity<ApiResponse<EventUserDto>> rejectParticipant(@PathVariable UUID eventUserId) {
        EventUserDto dto = eventUserService.rejectParticipant(eventUserId);

        log.info("Participant refusé, eventUserId={}", eventUserId);
        String message = messageService.get("EVENT.PARTICIPANT.REJECT.SUCCESS");
        return ResponseEntity.ok(new ApiResponse<>(message, dto));
    }

    /**
     * Récupère tous les événements auxquels l’utilisateur authentifié participe.
     *
     * @param authentication utilisateur connecté
     * @return liste des événements
     */
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/participating")
    public ResponseEntity<ApiResponse<List<EventUserDto>>> getEventsParticipating(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        List<EventUserDto> dtos = eventUserService.findByUserId(user.getId());

        log.info("Événements auxquels l’utilisateur participe récupérés");
        String message = messageService.get("EVENT.PARTICIPATING.LIST.SUCCESS");
        return ResponseEntity.ok(new ApiResponse<>(message, dtos));
    }

    /**
     * Récupère tous les événements organisés par l’utilisateur connecté.
     *
     * @param authentication utilisateur connecté
     * @return liste des événements organisés
     */
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/organized")
    public ResponseEntity<ApiResponse<List<EventUserDto>>> getEventsOrganized(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        List<EventUserDto> dtos = eventUserService.findOrganizedByUserId(user.getId());

        log.info("Événements organisés par l’utilisateur récupérés");
        String message = messageService.get("EVENT.ORGANIZED.LIST.SUCCESS");
        return ResponseEntity.ok(new ApiResponse<>(message, dtos));
    }

    /**
     * Permet à un organisateur de retirer un participant d’un événement.
     * Sécurisé par une règle custom : seul l'organisateur peut retirer un participant.
     * 
     * @param eventId identifiant de l’événement
     * @param userId identifiant du participant à retirer
     * @param authentication organisateur exécutant l'action
     * @return message de confirmation
     */
    @PreAuthorize("@eventSecurity.isOrganizer(#eventId)")
    @DeleteMapping("/{eventId}/participants/{userId}")
    public ResponseEntity<ApiResponse<Void>> removeParticipant(
            @PathVariable UUID eventId,
            @PathVariable UUID userId,
            Authentication authentication) {

        User organizer = getAuthenticatedUser(authentication);
        eventUserService.removeParticipant(eventId, userId, organizer.getId());
        
        log.info("Participant retiré de l’événement, eventId={}", eventId);
        String message = messageService.get("EVENT.PARTICIPANT.REMOVE.SUCCESS");
        return ResponseEntity.ok(new ApiResponse<>(message, null));
    }
}
