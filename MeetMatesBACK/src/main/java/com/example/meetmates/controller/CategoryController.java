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

/**
 * Contrôleur responsable de la gestion des catégories.
 *
 * Il permet :
 * - de récupérer toutes les catégories,
 * - de récupérer une catégorie particulière via son identifiant.
 *
 * Utilise ApiResponse pour garantir une structure uniforme des retours.
 * Les messages utilisateurs sont centralisés via MessageService, 
 * lequel lit les codes dans le fichier messages.properties (i18n)
 */
@Slf4j
@RestController
@RequestMapping("/category")
public class CategoryController {

    private final CategoryService categoryService;
    private final MessageSource messageSource;

    /**
     * Injection des dépendances nécessaires.
     *
     * @param categoryService service gérant la logique métier des catégories
     * @param messageSource gestionnaire des messages (i18n)
     */
    public CategoryController(CategoryService categoryService, MessageSource messageSource) {
        this.categoryService = categoryService;
        this.messageSource = messageSource;
    }

    /**
     * Permet de récupérer un message localisé depuis messages.properties.
     *
     * @param code clé du message
     * @return message localisé associé
     */
    private String msg(String code) {
        return messageSource.getMessage(code, null, Locale.getDefault());
    }

    /**
     * Récupère l'ensemble des catégories disponibles.
     *
     * @return liste des CategoryDto encapsulée dans ApiResponse
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<CategoryDto>>> getAll() {
        log.info("Récupération de toutes les catégories");

        var list = categoryService.findAll()
                .stream()
                .map(CategoryMapper::toDto)
                .toList();

        return ResponseEntity.ok(
                new ApiResponse<>(msg("CATEGORY_LIST_SUCCESS"), list)
        );
    }
    
    /**
     * Récupère une catégorie à partir de son identifiant.
     *
     * @param id identifiant UUID de la catégorie recherchée
     * @return CategoryDto correspondant à l'identifiant
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryDto>> getById(@PathVariable UUID id) {
        log.info("Récupération de la catégorie {}", id);

        var category = CategoryMapper.toDto(categoryService.findById(id));

        return ResponseEntity.ok(
                new ApiResponse<>(msg("CATEGORY_GET_SUCCESS"), category)
        );
    }
}
