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

    // ---------------------------------------------------------
    // GET ALL
    // ---------------------------------------------------------
    @GetMapping
    public ResponseEntity<List<ActivityDto>> getAll() {
        List<ActivityDto> list = activityService.findAll()
                .stream()
                .map(activityMapper::toDto)
                .toList();

        return ResponseEntity.ok(list);
    }

    // ---------------------------------------------------------
    // GET BY ID
    // ---------------------------------------------------------
    @GetMapping("/{id}")
    public ResponseEntity<ActivityDto> getById(@PathVariable UUID id) {
        Activity activity = activityService.findById(id);
        return ResponseEntity.ok(activityMapper.toDto(activity));
    }

    // ---------------------------------------------------------
    // GET BY CATEGORY
    // ---------------------------------------------------------
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<ActivityDto>> getByCategory(@PathVariable UUID categoryId) {
        List<ActivityDto> list = activityService.findByCategory(categoryId)
                .stream()
                .map(activityMapper::toDto)
                .toList();

        return ResponseEntity.ok(list);
    }

    // ---------------------------------------------------------
    // CREATE
    // ---------------------------------------------------------
    @PostMapping
    public ResponseEntity<ActivityDto> create(@RequestBody ActivityDto dto) {

        if (dto.getCategoryId() == null) {
            throw new IllegalArgumentException("categoryId ne peut pas être null");
        }

        Category category = categoryService.findById(dto.getCategoryId());
        if (category == null) {
            throw new IllegalArgumentException("Catégorie introuvable");
        }

        Activity activity = activityMapper.fromDto(dto, category);

        Activity saved = activityService.save(activity);

        return ResponseEntity.ok(activityMapper.toDto(saved));
    }

    // ---------------------------------------------------------
    // DELETE
    // ---------------------------------------------------------
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        activityService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
