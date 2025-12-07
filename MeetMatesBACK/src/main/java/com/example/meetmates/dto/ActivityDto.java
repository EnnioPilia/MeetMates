package com.example.meetmates.dto;

import java.util.UUID;

/**
 * DTO représentant une activité disponible dans l'application.
 *
 * Ce modèle est utilisé pour transférer les données d’une activité entre les couches de l'application (service, contrôleur, API).
 *
 * Une activité appartient toujours à une catégorie, identifiée par son UUID.
 */
public class ActivityDto {

    /** Identifiant unique de l’activité. */
    private UUID id;

    /** Nom de l’activité (ex. : "Football", "Randonnée"). */
    private String name;

    /** Identifiant unique de la catégorie à laquelle appartient l’activité. */
    private UUID categoryId;

    /**
     * Constructeur principal.
     *
     * @param id identifiant unique de l’activité
     * @param name nom de l’activité
     * @param categoryId identifiant de la catégorie associée
     */
    public ActivityDto(UUID id, String name, UUID categoryId) {
        this.id = id;
        this.name = name;
        this.categoryId = categoryId;
    }

    /** @return identifiant unique de l’activité */
    public UUID getId() { return id; }

    /** @param id identifiant unique de l’activité */
    public void setId(UUID id) { this.id = id; }

    /** @return nom de l’activité */
    public String getName() { return name; }

    /** @param name nom de l’activité */
    public void setName(String name) { this.name = name; }

    /** @return identifiant de la catégorie associée */
    public UUID getCategoryId() { return categoryId; }

    /** @param categoryId identifiant de la catégorie associée */
    public void setCategoryId(UUID categoryId) { this.categoryId = categoryId; }
}
