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

import com.example.meetmates.dto.ApiResponse;
import com.example.meetmates.dto.CategoryDto;
import com.example.meetmates.mapper.CategoryMapper;
import com.example.meetmates.service.CategoryService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/category")
public class CategoryController {

    private final CategoryService categoryService;
    private final MessageSource messageSource;

    public CategoryController(CategoryService categoryService, MessageSource messageSource) {
        this.categoryService = categoryService;
        this.messageSource = messageSource;
    }

    private String msg(String code) {
        return messageSource.getMessage(code, null, Locale.getDefault());
    }

    // GET all categories
    @GetMapping
    public ResponseEntity<ApiResponse<List<CategoryDto>>> getAll() {
        log.info("[CATEGORY] Récupération de toutes les catégories");

        var list = categoryService.findAll()
                .stream()
                .map(CategoryMapper::toDto)
                .toList();

        return ResponseEntity.ok(
                new ApiResponse<>(msg("CATEGORY_LIST_SUCCESS"), list)
        );
    }

    // GET category by id
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryDto>> getById(@PathVariable UUID id) {
        log.info("[CATEGORY] Récupération de la catégorie {}", id);

        var category = CategoryMapper.toDto(categoryService.findById(id));

        return ResponseEntity.ok(
                new ApiResponse<>(msg("CATEGORY_GET_SUCCESS"), category)
        );
    }
}
