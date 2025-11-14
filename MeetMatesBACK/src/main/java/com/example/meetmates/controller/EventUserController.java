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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.meetmates.dto.EventUserDto;
import com.example.meetmates.dto.JoinEventRequestDto;
import com.example.meetmates.model.EventUser;
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

    @PostMapping("/join")
    public ResponseEntity<EventUserDto> joinEvent(@RequestBody JoinEventRequestDto request, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }

        String email = authentication.getName();
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        EventUser eventUser = eventUserService.joinEvent(request.eventId(), currentUser.getId());
        return ResponseEntity.ok(EventUserDto.from(eventUser));
    }

    @DeleteMapping("/leave")
    public ResponseEntity<EventUserDto> leaveEvent(
            @RequestParam UUID eventId,
            Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }

        String email = authentication.getName();
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        EventUser eu = eventUserService.leaveEvent(eventId, currentUser.getId());
        return ResponseEntity.ok(EventUserDto.from(eu));
    }

    @PutMapping("/{eventUserId}/accept")
    public ResponseEntity<EventUserDto> acceptParticipant(@PathVariable UUID eventUserId, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }

        EventUser eu = eventUserService.acceptParticipant(eventUserId);
        return ResponseEntity.ok(EventUserDto.from(eu));
    }

    @PutMapping("/{eventUserId}/reject")
    public ResponseEntity<EventUserDto> rejectParticipant(@PathVariable UUID eventUserId, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }

        EventUser eu = eventUserService.rejectParticipant(eventUserId);
        return ResponseEntity.ok(EventUserDto.from(eu));
    }

    @GetMapping("/participating")
    public ResponseEntity<List<EventUserDto>> getEventsParticipating(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }

        String email = authentication.getName();
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        List<EventUser> participations = eventUserService.findByUserId(currentUser.getId());
        List<EventUserDto> dtos = participations.stream()
                .map(EventUserDto::from)
                .toList();

        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/organized")
    public ResponseEntity<List<EventUserDto>> getEventsOrganized(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }

        String email = authentication.getName();
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        List<EventUser> organized = eventUserService.findOrganizedByUserId(currentUser.getId());
        List<EventUserDto> dtos = organized.stream()
                .map(EventUserDto::from)
                .toList();

        return ResponseEntity.ok(dtos);
    }

    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/{eventId}/remove/{userId}")
    public ResponseEntity<String> removeParticipant(
            @PathVariable UUID eventId,
            @PathVariable UUID userId,
            Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("Non connecté");
        }

        String email = authentication.getName();
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        eventUserService.removeParticipant(eventId, userId, currentUser.getId());

        return ResponseEntity.ok("Participant retiré avec succès");
    }
}
