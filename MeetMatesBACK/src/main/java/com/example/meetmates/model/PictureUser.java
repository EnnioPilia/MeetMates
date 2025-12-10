package com.example.meetmates.model;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

/**
 * Entité représentant la photo principale d’un utilisateur.
 *
 * Cette entité stocke les informations liées à une image de profil :
 * - l’URL publique de l’image
 * - l’identifiant public dans le service de stockage
 * - le statut (ex : ACTIVE, DELETED)
 * - l’indicateur d’image principale
 * - les dates de création et de mise à jour
 *
 * Relations :
 * - One-To-One avec {@link User} : chaque utilisateur possède au maximum
 *   une image principale associée dans cette table.
 *
 * Cette entité permet de gérer proprement la photo de profil sans mélanger
 * les données de stockage avec la table User.
 */
@Entity
@Table(name = "picture_user")
public class PictureUser {

    /**
     * Identifiant UUID unique de l’image .
     * Généré automatiquement par Hibernate via un générateur UUID.
     */
    @Id
    @GeneratedValue
    private UUID id;

    /**
     * URL de l’image hébergée.
     */
    @Column(nullable = false)
    private String url;

    /**
     * Identifiant public du fichier dans le service de stockage .
     */
    @Column(name = "public_id")
    private String publicId;

    /**
     * Indique si cette image est l’image principale du profil.
     */
    @Column(name = "is_main", nullable = false)
    private boolean isMain = true;

    /**
     * Statut de l’image (ACTIVE, DELETED, etc.).
     */
    @Column(nullable = false)
    private String status = "ACTIVE";

    /**
     * Date de création de l’image.
     */
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    /**
     * Date de dernière mise à jour.
     */
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    /**
     * Relation One-To-One : une seule image principale par utilisateur.
     * Chaque PictureUser est associé à un seul User, et ce user ne peut avoir qu’une seule image principale.
     */
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;


    // --- GETTERS & SETTERS ---
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }

    public String getPublicId() { return publicId; }
    public void setPublicId(String publicId) { this.publicId = publicId; }

    public boolean isMain() { return isMain; }
    public void setMain(boolean main) { isMain = main; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}
