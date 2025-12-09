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
 * Entité représentant une catégorie d’activités.
 *
 * Une catégorie regroupe plusieurs activités du même type
 * Elle permet de classer les événements et d'offrir une navigation cohérente dans l'application.
 */
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Entity
@Table(name = "category")
public class Category {

    /**
     * Identifiant UUID unique de la catégorie.
     * Généré automatiquement par Hibernate via un générateur UUID.
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
