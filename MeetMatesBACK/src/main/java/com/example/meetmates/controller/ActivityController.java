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

import com.example.meetmates.dto.EventResponse;
import com.example.meetmates.model.core.Activity;
import com.example.meetmates.service.ActivityService;
import com.example.meetmates.service.EventService;

@RestController
@RequestMapping("/activity")
public class ActivityController {

    private final ActivityService activityService;
    private final EventService eventService;

    public ActivityController(ActivityService activityService, EventService eventService) {
        this.activityService = activityService;
        this.eventService = eventService;
    }

    // ✅ Récupérer toutes les activités
    @GetMapping
    public List<Activity> getAll() {
        return activityService.findAll();
    }

    // ✅ Récupérer une activité par ID
    @GetMapping("/{id}")
    public Activity getById(@PathVariable UUID id) {
        return activityService.findById(id);
    }

    // ✅ Récupérer toutes les activités d'une catégorie
    @GetMapping("/category/{categoryId}")
    public List<Activity> getByCategory(@PathVariable UUID categoryId) {
        return activityService.findByCategoryId(categoryId);
    }

    // ✅ Récupérer tous les événements liés à une activité
    @GetMapping("/{activityId}/events")
    public ResponseEntity<List<EventResponse>> getEventsByActivity(@PathVariable UUID activityId) {
        List<EventResponse> events = eventService.getEventsByActivity(activityId)
                                                 .stream()
                                                 .map(EventResponse::from)
                                                 .toList();
        return ResponseEntity.ok(events);
    }

    // ✅ Créer une activité
    @PostMapping
    public Activity create(@RequestBody Activity activity) {
        return activityService.save(activity);
    }

    // ✅ Supprimer une activité
    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id) {
        activityService.delete(id);
    }
}
