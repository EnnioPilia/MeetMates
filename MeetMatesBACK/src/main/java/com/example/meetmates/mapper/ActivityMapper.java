package com.example.meetmates.mapper;

import org.springframework.stereotype.Component;

import com.example.meetmates.dto.ActivityDto;
import com.example.meetmates.model.Activity;
import com.example.meetmates.model.Category;

@Component
public class ActivityMapper {

public ActivityDto toDto(Activity activity) {
    if (activity == null) return null;

    return new ActivityDto(
        activity.getId(),
        activity.getName(),
        activity.getCategory() != null ? activity.getCategory().getCategoryId() : null
    );
}

public Activity fromDto(ActivityDto dto, Category category) {
    Activity activity = new Activity();
    activity.setId(dto.getId());
    activity.setName(dto.getName());
    activity.setCategory(category);
    return activity;
}

}
