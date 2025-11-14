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

@RestController
@RequestMapping("/event")
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @PostMapping
    public ResponseEntity<EventResponseDto> createEvent(@RequestBody EventRequestDto req) {
        EventResponseDto event = eventService.createEvent(req);
        return ResponseEntity.ok(event);
    }

    @GetMapping
    public ResponseEntity<List<EventResponseDto>> getAllEvents() {
        return ResponseEntity.ok(eventService.findAllResponses());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventDetailsDto> getEventById(@PathVariable UUID id) {
        return ResponseEntity.ok(eventService.findEventDetailsById(id));
    }

    @GetMapping("/activity/{activityId}")
    public ResponseEntity<List<EventResponseDto>> getEventsByActivity(@PathVariable UUID activityId) {
        return ResponseEntity.ok(eventService.getEventResponsesByActivity(activityId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EventResponseDto> updateEvent(
            @PathVariable UUID id,
            @RequestBody EventRequestDto updatedEvent) {
        EventResponseDto updated = eventService.updateEvent(id, updatedEvent);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable UUID id) {
        eventService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<EventResponseDto>> searchEvents(@RequestParam String query) {
        List<EventResponseDto> results = eventService.searchEvents(query);
        return ResponseEntity.ok(results);
    }

}
