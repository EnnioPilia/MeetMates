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

import com.example.meetmates.dto.EventUserDto;
import com.example.meetmates.model.User;
import com.example.meetmates.repository.UserRepository;
import com.example.meetmates.service.EventUserService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/event-user")
public class EventUserController {

    private final EventUserService eventUserService;
    private final UserRepository userRepository;

    public EventUserController(EventUserService eventUserService, UserRepository userRepository) {
        this.eventUserService = eventUserService;
        this.userRepository = userRepository;
    }

    // *  Retourne l'utilisateur actuellement authentifié.
    private User getAuthenticatedUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            log.warn("[EVENT-USER] Tentative d'accès sans authentification");
            throw new RuntimeException("Utilisateur non connecté");
        }

        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> {
                    log.error("[EVENT-USER] Utilisateur introuvable en base : {}", authentication.getName());
                    return new RuntimeException("Utilisateur introuvable");
                });
    }


    // *  Permet à l'utilisateur connecté de rejoindre un événement.
    @PostMapping("/{eventId}/join")
    public ResponseEntity<EventUserDto> joinEvent(@PathVariable UUID eventId, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        log.info("[EVENT-USER] {} rejoint l'événement {}", user.getEmail(), eventId);

        EventUserDto dto = eventUserService.joinEvent(eventId, user.getId());
        return ResponseEntity.ok(dto);
    }


    // *  Permet à l'utilisateur connecté de quitter un événement.
    @DeleteMapping("/{eventId}/leave")
    public ResponseEntity<EventUserDto> leaveEvent(@PathVariable UUID eventId, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        log.info("[EVENT-USER] {} quitte l'événement {}", user.getEmail(), eventId);

        EventUserDto dto = eventUserService.leaveEvent(eventId, user.getId());
        return ResponseEntity.ok(dto);
    }


    // * L'organisateur accepte un participant.
    @PutMapping("/{eventUserId}/accept")
    public ResponseEntity<EventUserDto> acceptParticipant(@PathVariable UUID eventUserId, Authentication authentication) {
        getAuthenticatedUser(authentication);
        log.info("[EVENT-USER] Acceptation du participant {}", eventUserId);

        EventUserDto dto = eventUserService.acceptParticipant(eventUserId);
        return ResponseEntity.ok(dto);
    }


    // * L'organisateur rejette un participant.
    @PutMapping("/{eventUserId}/reject")
    public ResponseEntity<EventUserDto> rejectParticipant(@PathVariable UUID eventUserId, Authentication authentication) {
        getAuthenticatedUser(authentication);
        log.info("[EVENT-USER] Rejet du participant {}", eventUserId);

        EventUserDto dto = eventUserService.rejectParticipant(eventUserId);
        return ResponseEntity.ok(dto);
    }


    // * Liste des événements auxquels l'utilisateur connecté participe.
    @GetMapping("/participating")
    public ResponseEntity<List<EventUserDto>> getEventsParticipating(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        log.info("[EVENT-USER] Récupération des événements où participe {}", user.getEmail());

        List<EventUserDto> dtos = eventUserService.findByUserId(user.getId());
        return ResponseEntity.ok(dtos);
    }


    // * Liste des événements organisés par l'utilisateur connecté.
    @GetMapping("/organized")
    public ResponseEntity<List<EventUserDto>> getEventsOrganized(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        log.info("[EVENT-USER] Récupération des événements organisés par {}", user.getEmail());

        List<EventUserDto> dtos = eventUserService.findOrganizedByUserId(user.getId());
        return ResponseEntity.ok(dtos);
    }


    // * L'organisateur retire un participant d'un événement.
    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/{eventId}/participants/{userId}")
    public ResponseEntity<String> removeParticipant(
            @PathVariable UUID eventId,
            @PathVariable UUID userId,
            Authentication authentication) {

        User currentUser = getAuthenticatedUser(authentication);
        log.warn("[EVENT-USER] {} retire le participant {} de l'événement {}", currentUser.getEmail(), userId, eventId);

        eventUserService.removeParticipant(eventId, userId, currentUser.getId());
        return ResponseEntity.ok("Participant retiré avec succès");
    }
}
