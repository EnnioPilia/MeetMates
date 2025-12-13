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
 * Entité représentant une activité proposée dans l’application.
 *
 * Une activité correspond à un type d’événement. 
 * Elle est obligatoirement rattachée à une catégorie.
 *
 * L’entité stocke :
 * - un identifiant UUID unique
 * - un nom obligatoire
 * - sa catégorie parente
 * - les dates de création et de mise à jour
 *
 * Les champs createdAt et updatedAt sont gérés automatiquement via les
 * callbacks JPA @PrePersist et @PreUpdate.
 *
 * L’activité est rattachée à une catégorie via une relation Many-to-One.
 * La suppression d’une activité n’impacte pas la catégorie, et inversement,
 * sauf si la suppression provient du côté Category (orphanRemoval).
 */
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Entity
@Table(name = "activity")
public class Activity {

    /**
     * Identifiant UUID unique de l'activité.
     * Généré automatiquement par Hibernate via un générateur UUID.
     */
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @JdbcTypeCode(SqlTypes.CHAR)
    @Column(name = "activity_id", length = 36, updatable = false, nullable = false)
    private UUID id;

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

    /** Date et heure de création de l’activité (initialisée automatiquement). */
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /** Date et heure de dernière mise à jour (mise à jour automatiquement). */
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() { this.createdAt = LocalDateTime.now(); }

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
