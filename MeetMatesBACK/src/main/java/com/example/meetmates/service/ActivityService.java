package com.example.meetmates.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.example.meetmates.exception.ActivityNotFoundException;
import com.example.meetmates.model.Activity;
import com.example.meetmates.repository.ActivityRepository;

@Service
public class ActivityService {

    private final ActivityRepository activityRepository;

    public ActivityService(ActivityRepository activityRepository, CategoryService categoryService) {
        this.activityRepository = activityRepository;
    }

    public List<Activity> findAll() {
        return activityRepository.findAll();
    }

    public Activity findById(UUID id) {
        return activityRepository.findById(id)
                .orElseThrow(() -> new ActivityNotFoundException("Activité introuvable : " + id));
    }

    public List<Activity> findByCategory(UUID categoryId) {
        return activityRepository.findByCategory_CategoryId(categoryId);
    }

    public Activity save(Activity activity) {
        return activityRepository.save(activity);
    }

    public void delete(UUID id) {
        if (!activityRepository.existsById(id)) {
            throw new ActivityNotFoundException("Activité introuvable : " + id);
        }
        activityRepository.deleteById(id);
    }
}
