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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.meetmates.dto.EventDetailsDTO;
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
public ResponseEntity<EventDetailsDTO> getEventById(@PathVariable UUID id) {
    return ResponseEntity.ok(eventService.findEventDetailsById(id));
}



    // ✅ Récupérer les événements d’une activité
    @GetMapping("/activity/{activityId}")
    public ResponseEntity<List<EventResponse>> getEventsByActivity(@PathVariable UUID activityId) {
        return ResponseEntity.ok(eventService.getEventResponsesByActivity(activityId));
    }

    // ✅ Supprimer un événement
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable UUID id) {
        eventService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/picture")
    public ResponseEntity<EventResponse> uploadEventPicture(
            @PathVariable UUID id,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "isMain", defaultValue = "false") boolean isMain) {

        EventResponse updatedEvent = eventService.addPictureToEvent(id, file, isMain);
        return ResponseEntity.ok(updatedEvent);
    }

}
