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
import com.example.meetmates.mapper.ActivityMapper;
import com.example.meetmates.service.ActivityService;
import com.example.meetmates.service.CategoryService;

import lombok.extern.slf4j.Slf4j;

/**
 * Contrôleur responsable de la gestion des activités.
 *
 * Il permet :
 * - de récupérer toutes les activités disponibles,
 * - de récupérer une activité précise via son identifiant,
 * - de récupérer toutes les activités liées à une catégorie donnée.
 *
 * Toutes les réponses sont encapsulées dans ApiResponse pour garantir une structure homogène des retours de l'API.
 */
@Slf4j
@RestController
@RequestMapping("/activity")
public class ActivityController {

    private final ActivityService activityService;
    private final ActivityMapper activityMapper;
    private final MessageSource messageSource;
    
    /**
     * Injection des dépendances du contrôleur.
     *
     * @param activityService service gérant la logique métier des activités
     * @param activityMapper mapper permettant la conversion entité <-> DTO
     * @param messageSource gestionnaire des messages externes (i18n)
     */
    public ActivityController(
            ActivityService activityService,
            CategoryService categoryService,
            ActivityMapper activityMapper,
            MessageSource messageSource
    ) {
        this.activityService = activityService;
        this.activityMapper = activityMapper;
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
     * Récupère l'ensemble des activités.
     *
     * @return liste de ActivityDto encapsulée dans ApiResponse
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<ActivityDto>>> getAll() {

        var list = activityService.findAll()
                .stream()
                .map(activityMapper::toDto)
                .toList();

        log.info("getAll, total={}", list.size());

        return ResponseEntity.ok(
                new ApiResponse<>(msg("ACTIVITY_LIST_SUCCESS"), list)
        );
    }

    /**
     * Récupère une activité à partir de son identifiant.
     *
     * @param id identifiant unique de l'activité (UUID)
     * @return activité correspondante en DTO
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ActivityDto>> getById(@PathVariable UUID id) {
        var activity = activityMapper.toDto(activityService.findById(id));

        log.info("getById, id={}", id);

        return ResponseEntity.ok(
                new ApiResponse<>(msg("ACTIVITY_GET_SUCCESS"), activity)
        );
    }

    /**
     * Récupère toutes les activités associées à une catégorie donnée.
     *
     * @param categoryId identifiant de la catégorie (UUID)
     * @return liste des activités correspondant à cette catégorie
     */
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<ApiResponse<List<ActivityDto>>> getByCategory(@PathVariable UUID categoryId) {
        var list = activityService.findByCategory(categoryId)
                .stream()
                .map(activityMapper::toDto)
                .toList();

        log.info("getByCategory, categoryId={}, total={}", categoryId, list.size());

        return ResponseEntity.ok(
                new ApiResponse<>(msg("ACTIVITY_BY_CATEGORY_SUCCESS"), list)
        );
    }

}
