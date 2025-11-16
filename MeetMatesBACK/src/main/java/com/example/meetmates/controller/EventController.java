package com.example.meetmates.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.meetmates.dto.EventDetailsDto;
import com.example.meetmates.dto.EventRequestDto;
import com.example.meetmates.dto.EventResponseDto;
import com.example.meetmates.service.EventService;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/event")
@Slf4j
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    // * Création d’un nouvel événement
    @PostMapping
    public ResponseEntity<EventResponseDto> createEvent(@RequestBody EventRequestDto req) {
        log.info("[EVENT CTRL] POST /event – Création d’un événement");
        return ResponseEntity.ok(eventService.createEvent(req));
    }


    // * Récupère la liste de tous les événements
    @GetMapping
    public ResponseEntity<List<EventResponseDto>> getAllEvents() {
        log.info("[EVENT CTRL] GET /event – Récupération de tous les événements");
        return ResponseEntity.ok(eventService.findAllResponses());
    }


    // * Récupère un événement par son ID
    @GetMapping("/{id}")
    public ResponseEntity<EventDetailsDto> getEventById(@PathVariable UUID id) {
        log.info("[EVENT CTRL] GET /event/{} – Détails de l’événement", id);
        return ResponseEntity.ok(eventService.findEventDetailsById(id));
    }


    // * Récupère tous les événements liés à une activité
    @GetMapping("/activity/{activityId}")
    public ResponseEntity<List<EventResponseDto>> getEventsByActivity(@PathVariable UUID activityId) {
        log.info("[EVENT CTRL] GET /event/activity/{} – Événements par activité", activityId);
        return ResponseEntity.ok(eventService.getEventResponsesByActivity(activityId));
    }


    // * Mise à jour d’un événement existant
    @PutMapping("/{id}")
    public ResponseEntity<EventResponseDto> updateEvent(
            @PathVariable UUID id, @RequestBody EventRequestDto updatedEvent) {
        log.info("[EVENT CTRL] PUT /event/{} – Mise à jour de l’événement", id);
        return ResponseEntity.ok(eventService.updateEvent(id, updatedEvent));
    }

    // * Suppression d’un événement par ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable UUID id) {
        log.warn("[EVENT CTRL] DELETE /event/{} – Suppression d’un événement", id);
        eventService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // *  Recherche d’événements par mot-clé
    @GetMapping("/search")
    public ResponseEntity<List<EventResponseDto>> searchEvents(@RequestParam String query) {
        log.info("[EVENT CTRL] GET /event/search – Recherche : '{}'", query);
        return ResponseEntity.ok(eventService.searchEvents(query));
    }
}
