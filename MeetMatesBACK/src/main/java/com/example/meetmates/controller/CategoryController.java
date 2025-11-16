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

import com.example.meetmates.dto.CategoryDto;
import com.example.meetmates.mapper.CategoryMapper;
import com.example.meetmates.model.Category;
import com.example.meetmates.service.CategoryService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/category")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    // * Récupère toutes les catégories disponibles.
    @GetMapping
    public ResponseEntity<List<CategoryDto>> getAll() {
        log.info("[CATEGORY] Récupération de toutes les catégories");

        return ResponseEntity.ok(
                categoryService.findAll()
                        .stream()
                        .map(CategoryMapper::toDto)
                        .toList()
        );
    }

    // * Récupère une catégorie par son ID.
    @GetMapping("/{id}")
    public ResponseEntity<CategoryDto> getById(@PathVariable UUID id) {
        log.info("[CATEGORY] Récupération de la catégorie {}", id);

        Category category = categoryService.findById(id);
        return ResponseEntity.ok(CategoryMapper.toDto(category));
    }

    // * Crée une nouvelle catégorie.
    @PostMapping
    public ResponseEntity<CategoryDto> create(@RequestBody CategoryDto dto) {
        log.info("[CATEGORY] Création d'une catégorie : {}", dto.getName());

        Category category = CategoryMapper.fromDto(dto);
        Category saved = categoryService.save(category);

        return ResponseEntity.ok(CategoryMapper.toDto(saved));
    }

    // * Supprime une catégorie existante.
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        log.warn("[CATEGORY] Suppression de la catégorie {}", id);

        categoryService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
