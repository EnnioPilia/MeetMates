package com.example.meetmates.model;

import java.util.List;
import java.util.UUID;

import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

/**
 * Entité représentant une catégorie d’activités dans l'application.
 *
 * Une catégorie permet de regrouper plusieurs activités partageant un même thème.
 * Elle sert à structurer et organiser les événements, afin de faciliter la
 * navigation, le filtrage et la recherche pour les utilisateurs.
 *
 * L’entité stocke :
 * - un identifiant UUID unique
 * - un nom obligatoire et unique
 * - une image illustrative optionnelle
 * - la liste des activités qui lui sont associées
 *
 * La relation One-To-Many assure qu’une catégorie peut regrouper plusieurs
 * activités, et la suppression d’une catégorie entraîne également la
 * suppression des activités liées (orphan removal).
 */

@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Entity
@Table(name = "category")
public class Category {

    /**
     * Identifiant UUID unique de la catégorie.
     * Généré automatiquement par Hibernate via un générateur UUID.
     * et stocké en tant que chaîne de caractères (CHAR 36).
     */
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(
            name = "UUID",
            strategy = "org.hibernate.id.UUIDGenerator"
    )
    @JdbcTypeCode(SqlTypes.CHAR)
    @Column(name = "category_id", updatable = false, nullable = false, length = 36)
    private UUID categoryId;

    /**
     * Nom de la catégorie.
     */
    @Column(nullable = false, unique = true)
    private String name;

    /**
     * URL d’une image représentant la catégorie.
     * Optionnelle : peut être null si aucune image n’est fournie.
     */
    @Column(name = "image_url")
    private String imageUrl;

    /**
     * Liste des activités associées à cette catégorie.
     * Relation One-To-Many : une catégorie peut contenir plusieurs activités.
     * Supprimer une catégorie entraîne la suppression de ses activités.
     */
    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Activity> activities;


    // --- GETTERS & SETTERS ---
    public UUID getCategoryId() { return categoryId; }
    public void setCategoryId(UUID categoryId) { this.categoryId = categoryId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public List<Activity> getActivities() { return activities; }
    public void setActivities(List<Activity> activities) { this.activities = activities; }
}
