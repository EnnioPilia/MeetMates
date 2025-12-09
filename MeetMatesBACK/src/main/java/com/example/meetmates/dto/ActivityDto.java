package com.example.meetmates.dto;

import java.util.UUID;

/**
 * DTO représentant une activité disponible dans l'application.
 * 
 * Utilisé pour transférer des données entre les couches sans exposer l'entité JPA.
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
     * Construit un DTO représentant une activité.
     * @param id identifiant unique de l’activité
     * @param name nom de l’activité
     * @param categoryId identifiant de la catégorie associée
     */
    public ActivityDto(UUID id, String name, UUID categoryId) {
        this.id = id;
        this.name = name;
        this.categoryId = categoryId;
    }

    // --- GETTERS & SETTERS ---
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public UUID getCategoryId() { return categoryId; }
    public void setCategoryId(UUID categoryId) { this.categoryId = categoryId; }
}
