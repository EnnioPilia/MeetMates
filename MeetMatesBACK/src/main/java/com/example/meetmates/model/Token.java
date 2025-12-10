package com.example.meetmates.model;

import java.time.Instant;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

/**
 * Entité représentant un token sécurisé utilisé pour des opérations sensibles :
 * - vérification d’adresse email
 * - réinitialisation de mot de passe
 * - actions nécessitant une validation temporaire
 *
 * Relations :
 * - Many-to-One avec {@link User} : un utilisateur peut posséder plusieurs tokens
 *
 * Le token contient :
 * - une valeur unique (string)
 * - des métadonnées temporelles (création, expiration, confirmation)
 * - un statut d’utilisation (utilisé ou non)
 * - un type fonctionnel ({@link TokenType})
 *
 * Cette entité sert de base à tous les flux de sécurité nécessitant un code
 * temporaire ou un lien signé.
 */
@Entity
public class Token {

    /**
     * Identifiant UUID unique du token.
     * Généré automatiquement par Hibernate via un générateur UUID.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    /**
     * Valeur du token, stockée sous forme de chaîne unique.
     */
    @Column(nullable = false, unique = true)
    private String token;

    /**
     * Relation Many-To-One : plusieurs tokens peuvent appartenir au même utilisateur.
     * Utilisé pour lier le token à l’utilisateur concerné.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /**
     * Date et heure de création du token.
     */
    @Column(nullable = false)
    private Instant createdAt;

    /**
     * Date d’expiration du token.
     * Une fois dépassée, le token n’est plus valide.
     */
    private Instant expiresAt;

    /**
     * Date de confirmation (utilisée pour les tokens de vérification d’email).
     */
    private Instant confirmedAt;

    /**
     * Indique si le token a déjà été utilisé.
     * Pratique pour les tokens de réinitialisation de mot de passe.
     */
    private boolean used = false;

    /**
     * Type du token (RESET_PASSWORD, VERIFY_EMAIL, etc.).
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TokenType type;

    // --- CONSTRUCTEURS ---
    public Token() {}

    public Token(String token, User user, Instant createdAt, Instant expiresAt, TokenType type) {
        this.token = token;
        this.user = user;
        this.createdAt = createdAt;
        this.expiresAt = expiresAt;
        this.type = type;
    }

    // --- GETTERS & SETTERS ---
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getExpiresAt() { return expiresAt; }
    public void setExpiresAt(Instant expiresAt) { this.expiresAt = expiresAt; }

    public Instant getConfirmedAt() { return confirmedAt; }
    public void setConfirmedAt(Instant confirmedAt) { this.confirmedAt = confirmedAt; }

    public boolean isUsed() { return used; }
    public void setUsed(boolean used) { this.used = used; }

    public TokenType getType() { return type; }
    public void setType(TokenType type) { this.type = type; }
}
