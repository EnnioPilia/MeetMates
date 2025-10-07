package com.example.meetmates.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.meetmates.dto.EventRequest;
import com.example.meetmates.dto.EventResponse;
import com.example.meetmates.service.EventService;

@RestController
@RequestMapping("/event")
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    // ✅ Créer un événement
    @PostMapping
    public ResponseEntity<EventResponse> createEvent(@RequestBody EventRequest req) {
        EventResponse event = eventService.createEvent(req);
        return ResponseEntity.ok(event);
    }

    // ✅ Récupérer tous les événements
    @GetMapping
    public ResponseEntity<List<EventResponse>> getAllEvents() {
        return ResponseEntity.ok(eventService.findAllResponses());
    }

    // ✅ Récupérer un événement par ID
    @GetMapping("/{id}")
    public ResponseEntity<EventResponse> getEventById(@PathVariable UUID id) {
        EventResponse event = eventService.findResponseById(id);
        return (event != null) ? ResponseEntity.ok(event) : ResponseEntity.notFound().build();
    }

    // ✅ Récupérer les événements d’une activité
    @GetMapping("/activity/{activityId}")
    public ResponseEntity<List<EventResponse>> getEventsByActivity(@PathVariable UUID activityId) {
        List<EventResponse> events = eventService.getEventsByActivity(activityId)
                                                 .stream()
                                                 .map(EventResponse::from)
                                                 .toList();
        return ResponseEntity.ok(events);
    }

    // ✅ Supprimer un événement
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable UUID id) {
        eventService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
