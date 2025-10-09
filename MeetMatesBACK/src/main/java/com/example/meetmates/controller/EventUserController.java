package com.example.meetmates.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.meetmates.dto.EventUserDTO;
import com.example.meetmates.dto.JoinEventRequest;
import com.example.meetmates.model.core.EventUser;
import com.example.meetmates.model.core.User;
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
    public ResponseEntity<EventUserDTO> joinEvent(@RequestBody JoinEventRequest request, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }

        String email = authentication.getName();
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        EventUser eventUser = eventUserService.joinEvent(request.eventId(), currentUser.getId());
        return ResponseEntity.ok(EventUserDTO.from(eventUser));
    }

    /**
     * ❌ Quitter un événement (utilise l'utilisateur connecté)
     */
    @DeleteMapping("/leave")
    public ResponseEntity<String> leaveEvent(@RequestParam UUID eventId, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("Non connecté");
        }

        String email = authentication.getName();
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        eventUserService.leaveEvent(eventId, currentUser.getId());
        return ResponseEntity.ok("Utilisateur retiré de l'événement");
    }

    /**
     * 📋 Récupérer les événements auxquels l'utilisateur connecté participe
     */
    @GetMapping("/participating")
    public ResponseEntity<List<EventUserDTO>> getEventsParticipating(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }

        String email = authentication.getName();
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        List<EventUser> participations = eventUserService.findByUserId(currentUser.getId());
        List<EventUserDTO> dtos = participations.stream()
                .map(EventUserDTO::from)
                .toList();

        return ResponseEntity.ok(dtos);
    }

    /**
     * 🧑‍💼 Récupérer les événements organisés par l'utilisateur connecté
     */
    @GetMapping("/organized")
    public ResponseEntity<List<EventUserDTO>> getEventsOrganized(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }

        String email = authentication.getName();
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        List<EventUser> organized = eventUserService.findOrganizedByUserId(currentUser.getId());
        List<EventUserDTO> dtos = organized.stream()
                .map(EventUserDTO::from)
                .toList();

        return ResponseEntity.ok(dtos);
    }
}
