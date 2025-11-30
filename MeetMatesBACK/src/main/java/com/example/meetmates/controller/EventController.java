package com.example.meetmates.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.meetmates.dto.ApiResponse;
import com.example.meetmates.dto.EventDetailsDto;
import com.example.meetmates.dto.EventRequestDto;
import com.example.meetmates.dto.EventResponseDto;
import com.example.meetmates.service.EventService;
import com.example.meetmates.service.MessageService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/event")
@RequiredArgsConstructor
@Slf4j
public class EventController {

    private final EventService eventService;
    private final MessageService messageService;

    // ---------------------------------------------------------
    // CREATE EVENT
    // ---------------------------------------------------------
    @PreAuthorize("isAuthenticated()")
    @PostMapping
    public ResponseEntity<ApiResponse<EventResponseDto>> create(@RequestBody EventRequestDto request) {
        EventResponseDto dto = eventService.createEvent(request);
        log.info("Événement créé : {}");
        String message = messageService.get("event.create.success");
        return ResponseEntity.ok(new ApiResponse<>(message, dto));
    }

    // ---------------------------------------------------------
    // GET ALL EVENTS
    // ---------------------------------------------------------
    @GetMapping
    public ResponseEntity<ApiResponse<List<EventResponseDto>>> findAll() {
        List<EventResponseDto> dtos = eventService.findAllResponses();
        String message = messageService.get("event.list.success");
        return ResponseEntity.ok(new ApiResponse<>(message, dtos));
    }

    // ---------------------------------------------------------
    // GET EVENT DETAILS BY ID
    // ---------------------------------------------------------
    @GetMapping("/{eventId}")
    public ResponseEntity<ApiResponse<EventDetailsDto>> findById(@PathVariable UUID eventId) {
        EventDetailsDto dto = eventService.findEventDetailsById(eventId);
        String message = messageService.get("event.get.success");
        return ResponseEntity.ok(new ApiResponse<>(message, dto));
    }

    // ---------------------------------------------------------
    // GET EVENTS BY ACTIVITY ID
    // ---------------------------------------------------------
    @GetMapping("/activity/{activityId}")
    public ResponseEntity<ApiResponse<List<EventResponseDto>>> findByActivity(@PathVariable UUID activityId) {
        List<EventResponseDto> dtos = eventService.getEventResponsesByActivity(activityId);
        String message = messageService.get("event.by_activity.success");
        return ResponseEntity.ok(new ApiResponse<>(message, dtos));
    }

    // ---------------------------------------------------------
    // UPDATE EVENT
    // ---------------------------------------------------------
    @PreAuthorize("@eventSecurity.isOrganizer(#eventId)")
    @PutMapping("/{eventId}")
    public ResponseEntity<ApiResponse<EventResponseDto>> update(
            @PathVariable UUID eventId,
            @RequestBody EventRequestDto request
    ) {
        EventResponseDto dto = eventService.updateEvent(eventId, request);
        log.info("Événement mis à jour : {}");
        String message = messageService.get("event.update.success");
        return ResponseEntity.ok(new ApiResponse<>(message, dto));
    }

    // ---------------------------------------------------------
    // DELETE EVENT
    // ---------------------------------------------------------
    @PreAuthorize("@eventSecurity.isOrganizer(#eventId)")
    @DeleteMapping("/{eventId}")
    public ResponseEntity<ApiResponse<Void>> deleteEvent(@PathVariable UUID eventId) {
        eventService.deleteEvent(eventId);
        log.info("Événement supprimé : {}", eventId);
        String message = messageService.get("event.delete.success");
        return ResponseEntity.ok(new ApiResponse<>(message, null));
    }

    // ---------------------------------------------------------
    // SEARCH
    // ---------------------------------------------------------
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<EventResponseDto>>> search(@RequestParam String query) {
        List<EventResponseDto> dtos = eventService.searchEvents(query);
        String message = messageService.get("event.search.success");
        return ResponseEntity.ok(new ApiResponse<>(message, dtos));
    }
}
