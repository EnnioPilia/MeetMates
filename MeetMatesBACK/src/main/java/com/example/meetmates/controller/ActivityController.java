package com.example.meetmates.controller;

import java.util.List;
import java.util.Locale;
import java.util.UUID;

import org.springframework.context.MessageSource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.meetmates.dto.ActivityDto;
import com.example.meetmates.dto.ApiResponse;
import com.example.meetmates.exception.ErrorCode;
import com.example.meetmates.mapper.ActivityMapper;
import com.example.meetmates.service.ActivityService;
import com.example.meetmates.service.CategoryService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/activity")
public class ActivityController {

    private final ActivityService activityService;
    private final CategoryService categoryService;
    private final ActivityMapper activityMapper;
    private final MessageSource messageSource;

    public ActivityController(
            ActivityService activityService,
            CategoryService categoryService,
            ActivityMapper activityMapper,
            MessageSource messageSource
    ) {
        this.activityService = activityService;
        this.categoryService = categoryService;
        this.activityMapper = activityMapper;
        this.messageSource = messageSource;
    }

    private String msg(ErrorCode code) {
        return messageSource.getMessage(code.name(), null, Locale.getDefault());
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ActivityDto>>> getAll() {
        log.info("[ACTIVITY] getAll");

        var list = activityService.findAll()
                .stream()
                .map(activityMapper::toDto)
                .toList();

        return ResponseEntity.ok(
                new ApiResponse<>("ACTIVITY_LIST_SUCCESS", list)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ActivityDto>> getById(@PathVariable UUID id) {
        log.info("[ACTIVITY] getById {}", id);

        var activity = activityMapper.toDto(activityService.findById(id));

        return ResponseEntity.ok(
                new ApiResponse<>("ACTIVITY_GET_SUCCESS", activity)
        );
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<ApiResponse<List<ActivityDto>>> getByCategory(@PathVariable UUID categoryId) {
        log.info("[ACTIVITY] getByCategory {}", categoryId);

        var list = activityService.findByCategory(categoryId)
                .stream()
                .map(activityMapper::toDto)
                .toList();

        return ResponseEntity.ok(
                new ApiResponse<>("ACTIVITY_BY_CATEGORY_SUCCESS", list)
        );
    }

}
