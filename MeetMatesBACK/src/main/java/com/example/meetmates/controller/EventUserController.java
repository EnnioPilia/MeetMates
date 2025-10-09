package com.example.meetmates.controller;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.meetmates.dto.EventUserDTO;
import com.example.meetmates.dto.JoinEventRequest;
import com.example.meetmates.model.core.EventUser;
import com.example.meetmates.service.EventUserService;

@RestController
@RequestMapping("/event-user")
public class EventUserController {

    private final EventUserService eventUserService;

    public EventUserController(EventUserService eventUserService) {
        this.eventUserService = eventUserService;
    }

    @PostMapping("/join")
    public ResponseEntity<EventUserDTO> joinEvent(@RequestBody JoinEventRequest request) {
        EventUser eventUser = eventUserService.joinEvent(request.eventId(), request.userId());
        return ResponseEntity.ok(EventUserDTO.from(eventUser));
    }

    @DeleteMapping("/leave")
    public ResponseEntity<String> leaveEvent(@RequestParam UUID eventId, @RequestParam UUID userId) {
        eventUserService.leaveEvent(eventId, userId);
        return ResponseEntity.ok("Utilisateur retiré de l'événement");
    }
}
