package com.example.meetmates.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.example.meetmates.model.core.Activity;
import com.example.meetmates.repository.ActivityRepository;

@Service
public class ActivityService {

    private final ActivityRepository activityRepository;

    public ActivityService(ActivityRepository activityRepository) {
        this.activityRepository = activityRepository;
    }

    public List<Activity> findAll() {
        return activityRepository.findAll();
    }

    public Activity findById(UUID id) {
        return activityRepository.findById(id).orElse(null);
    }

    public Activity save(Activity activity) {
        return activityRepository.save(activity);
    }

    public void delete(UUID id) {
        activityRepository.deleteById(id);
    }
    public List<Activity> findByCategoryId(UUID categoryId) {
    return activityRepository.findByCategory_CategoryId(categoryId);
}

}
