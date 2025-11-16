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

import com.example.meetmates.dto.ActivityDto;
import com.example.meetmates.mapper.ActivityMapper;
import com.example.meetmates.model.Activity;
import com.example.meetmates.model.Category;
import com.example.meetmates.service.ActivityService;
import com.example.meetmates.service.CategoryService;
import com.example.meetmates.service.EventService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/activity")
public class ActivityController {

    private final ActivityService activityService;
    private final CategoryService categoryService;
    private final EventService eventService;
    private final ActivityMapper activityMapper;

    public ActivityController(
            ActivityService activityService,
            CategoryService categoryService,
            EventService eventService,
            ActivityMapper activityMapper
    ) {
        this.activityService = activityService;
        this.categoryService = categoryService;
        this.eventService = eventService;
        this.activityMapper = activityMapper;
    }

    // * Récupère la liste complète des activités.
    @GetMapping
    public ResponseEntity<List<ActivityDto>> getAll() {

        log.info("[ACTIVITY] Récupération de toutes les activités");

        List<ActivityDto> list = activityService.findAll()
                .stream()
                .map(activityMapper::toDto)
                .toList();

        log.info("[ACTIVITY] {} activités trouvées", list.size());
        return ResponseEntity.ok(list);
    }

    // * Récupère une activité par son ID.
    @GetMapping("/{id}")
    public ResponseEntity<ActivityDto> getById(@PathVariable UUID id) {

        log.info("[ACTIVITY] Récupération activity id={}", id);

        Activity activity = activityService.findById(id);

        log.info("[ACTIVITY] Activity trouvée : {}", activity.getName());
        return ResponseEntity.ok(activityMapper.toDto(activity));
    }

    // * Récupère toutes les activités liées à une catégorie.
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<ActivityDto>> getByCategory(@PathVariable UUID categoryId) {

        log.info("[ACTIVITY] Récupération des activités pour categoryId={}", categoryId);

        List<ActivityDto> list = activityService.findByCategory(categoryId)
                .stream()
                .map(activityMapper::toDto)
                .toList();

        log.info("[ACTIVITY] {} activités trouvées pour catégorie {}", list.size(), categoryId);
        return ResponseEntity.ok(list);
    }

    // * Création d'une nouvelle activité.
    @PostMapping
    public ResponseEntity<ActivityDto> create(@RequestBody ActivityDto dto) {

        log.info("[ACTIVITY] Tentative de création d'une activité : {}", dto.getName());

        if (dto.getCategoryId() == null) {
            log.warn("[ACTIVITY] Échec création : categoryId manquant");
            throw new IllegalArgumentException("categoryId ne peut pas être null");
        }

        Category category = categoryService.findById(dto.getCategoryId());
        if (category == null) {
            log.warn("[ACTIVITY] Échec création : catégorie introuvable ({})", dto.getCategoryId());
            throw new IllegalArgumentException("Catégorie introuvable");
        }

        Activity activity = activityMapper.fromDto(dto, category);
        Activity saved = activityService.save(activity);

        log.info("[ACTIVITY] Activité créée avec succès : {}", saved.getId());
        return ResponseEntity.ok(activityMapper.toDto(saved));
    }

    // * Suppression d'une activité par son ID.
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {

        log.info("[ACTIVITY] Suppression activité id={}", id);

        activityService.delete(id);

        log.info("[ACTIVITY] Activité supprimée");
        return ResponseEntity.noContent().build();
    }
}
