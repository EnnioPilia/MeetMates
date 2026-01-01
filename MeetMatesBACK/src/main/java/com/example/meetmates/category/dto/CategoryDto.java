package com.example.meetmates.category.dto;

import java.util.UUID;

/**
 * DTO représentant une catégorie d’activités dans l'application.
 * 
 * Utilisé pour transférer des données entre les couches sans exposer l'entité JPA.
 * 
 * Une catégorie regroupe plusieurs activités, identifiée par son UUID.
 */
public class CategoryDto {

    private UUID id;
    private String name;

    /**
     * Construit un DTO représentant une catégorie.
     * @param id identifiant unique de la catégorie
     * @param name nom de la catégorie
     */
    public CategoryDto(UUID id, String name) {
        this.id = id;
        this.name = name;
    }

    // --- GETTERS & SETTERS ---
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}
