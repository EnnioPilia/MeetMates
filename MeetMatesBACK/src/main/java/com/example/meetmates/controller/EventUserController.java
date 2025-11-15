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

@RestController
@RequestMapping("/event-user")
public class EventUserController {

    private final EventUserService eventUserService;
    private final UserRepository userRepository;

    public EventUserController(EventUserService eventUserService, UserRepository userRepository) {
        this.eventUserService = eventUserService;
        this.userRepository = userRepository;
    }

    // Méthode privée pour obtenir l'utilisateur connecté
    private User getAuthenticatedUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Utilisateur non connecté");
        }

        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
    }

    // Rejoindre un événement
    @PostMapping("/{eventId}/join")
    public ResponseEntity<EventUserDto> joinEvent(@PathVariable UUID eventId, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        EventUserDto dto = eventUserService.joinEvent(eventId, user.getId());
        return ResponseEntity.ok(dto);
    }

    // Quitter un événement
    @DeleteMapping("/{eventId}/leave")
    public ResponseEntity<EventUserDto> leaveEvent(@PathVariable UUID eventId, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        EventUserDto dto = eventUserService.leaveEvent(eventId, user.getId());
        return ResponseEntity.ok(dto);
    }

    // Accepter un participant
    @PutMapping("/{eventUserId}/accept")
    public ResponseEntity<EventUserDto> acceptParticipant(@PathVariable UUID eventUserId, Authentication authentication) {
        getAuthenticatedUser(authentication);
        EventUserDto dto = eventUserService.acceptParticipant(eventUserId);
        return ResponseEntity.ok(dto);
    }

    // Refuser un participant
    @PutMapping("/{eventUserId}/reject")
    public ResponseEntity<EventUserDto> rejectParticipant(@PathVariable UUID eventUserId, Authentication authentication) {
        getAuthenticatedUser(authentication);
        EventUserDto dto = eventUserService.rejectParticipant(eventUserId);
        return ResponseEntity.ok(dto);
    }

    // Événements auxquels l’utilisateur participe
    @GetMapping("/participating")
    public ResponseEntity<List<EventUserDto>> getEventsParticipating(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        List<EventUserDto> dtos = eventUserService.findByUserId(user.getId());
        return ResponseEntity.ok(dtos);
    }

    // Événements organisés par l’utilisateur
    @GetMapping("/organized")
    public ResponseEntity<List<EventUserDto>> getEventsOrganized(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        List<EventUserDto> dtos = eventUserService.findOrganizedByUserId(user.getId());
        return ResponseEntity.ok(dtos);
    }

    // Retirer un participant (organisateur)
    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/{eventId}/participants/{userId}")
    public ResponseEntity<String> removeParticipant(@PathVariable UUID eventId, @PathVariable UUID userId, Authentication authentication) {
        User currentUser = getAuthenticatedUser(authentication);
        eventUserService.removeParticipant(eventId, userId, currentUser.getId());
        return ResponseEntity.ok("Participant retiré avec succès");
    }
}
