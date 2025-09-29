package com.example.meetmates.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.meetmates.model.core.Activity;
import com.example.meetmates.service.ActivityService;

@RestController
@RequestMapping("/activity")
public class ActivityController {

    private final ActivityService activityService;

    public ActivityController(ActivityService activityService) {
        this.activityService = activityService;
    }

    @GetMapping
    public List<Activity> getAll() {
        return activityService.findAll();
    }

    @GetMapping("/{id}")
    public Activity getById(@PathVariable UUID id) {
        return activityService.findById(id);
    }

    @GetMapping("/category/{categoryId}")
    public List<Activity> getByCategory(@PathVariable UUID categoryId) {
        return activityService.findByCategoryId(categoryId);
    }

    @PostMapping
    public Activity create(@RequestBody Activity activity) {
        return activityService.save(activity);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id) {
        activityService.delete(id);
    }
}
