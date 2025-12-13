package com.example.meetmates.model;

import java.time.LocalDateTime;
import java.util.UUID;

import org.hibernate.annotations.Where;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

/**
 * Entité représentant une photo de profil d’un utilisateur.
 *
 * Cette entité stocke les informations liées à une image :
 * - l’URL publique de l’image
 * - l’identifiant public dans le service de stockage
 * - l’indicateur de photo principale
 * - les dates de création, mise à jour et suppression logique
 *
 * Relation :
 * - Many-To-One avec {@link User} :
 *   un utilisateur peut posséder plusieurs photos (historique),
 *   mais une seule photo active à la fois (main = true).
 *
 * Les suppressions sont gérées via un soft delete (deletedAt).
 */
@Entity
@Table(name = "picture_user")
@Where(clause = "deleted_at IS NULL")
public class PictureUser {

    /**
     * Identifiant UUID unique de la relation participant–événement .
     * Généré automatiquement par Hibernate via un générateur UUID.
     */
    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false)
    private String url;

    /**
     * Identifiant public du fichier dans le service de stockage.
     */
    @Column(name = "public_id", nullable = false)
    private String publicId;

    /**
     * Indique si cette image est la photo principale active.
     */
    @Column(name = "is_main", nullable = false)
    private boolean main;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    /**
     * Relation Many-To-One :
     * un utilisateur peut avoir plusieurs photos dans l’historique.
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // --- GETTERS & SETTERS ---
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }

    public String getPublicId() { return publicId; }
    public void setPublicId(String publicId) { this.publicId = publicId; }

    public boolean isMain() { return main; }
    public void setMain(boolean main) { this.main = main; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public LocalDateTime getDeletedAt() { return deletedAt; }
    public void setDeletedAt(LocalDateTime deletedAt) { this.deletedAt = deletedAt; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

}
