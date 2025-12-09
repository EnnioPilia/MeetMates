package com.example.meetmates.model;

import java.time.LocalDateTime;
import java.util.UUID;

import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

/**
 * Entité représentant une activité disponible dans l'application.
 * Une activité appartient à une catégorie et contient des métadonnées
 * d'audit telles que la date de création et de mise à jour.
 *
 * L'entité est stockée dans la table "activity" et utilise un UUID comme identifiant unique.
 */
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Entity
@Table(name = "activity")
public class Activity {

    /**
     * Identifiant UUID unique de l'activité.
     * Généré automatiquement par Hibernate via un générateur UUID.
     * et stocké en tant que chaîne de caractères (CHAR 36).
     */
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @JdbcTypeCode(SqlTypes.CHAR)
    @Column(name = "activity_id", length = 36, updatable = false, nullable = false)
    private UUID id;

    /**
     * Nom de l’activité. Ne peut pas être nul.
     */
    @Column(nullable = false)
    private String name;

    /**
     * Catégorie à laquelle l’activité est rattachée.
     * Relation Many-to-One avec l'entité Category.
     */
    @ManyToOne
    @JoinColumn(name = "category_id")
    @JsonBackReference
    private Category category;

    /**
     * Date et heure de création de l’activité.
     * Définie automatiquement lors de la première persistance.
     */
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /**
     * Date et heure de la dernière mise à jour de l’activité.
     * Mise à jour automatiquement lors de toute modification de l'entité.
     */
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    /** Initialise automatiquement la date de création avant l'insertion en base de données. */
    @PrePersist
    protected void onCreate() { this.createdAt = LocalDateTime.now(); }

    /** Met à jour automatiquement la date de modification avant toute mise à jour de l'entité. */
    @PreUpdate
    protected void onUpdate() { this.updatedAt = LocalDateTime.now(); }

    
    // --- GETTERS & SETTERS ---
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

}
