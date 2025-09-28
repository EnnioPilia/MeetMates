package com.example.meetmates.model.security;

import java.time.Instant;
import java.util.UUID;

import com.example.meetmates.model.core.User;

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

@Entity
public class Token {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String token;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private Instant createdAt;

    private Instant expiresAt;

    private Instant confirmedAt; // pour les tokens de vérification

    private boolean used = false; // pour les tokens de reset mot de passe

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TokenType type;

    // Constructeurs
    public Token() {}

    public Token(String token, User user, Instant createdAt, Instant expiresAt, TokenType type) {
        this.token = token;
        this.user = user;
        this.createdAt = createdAt;
        this.expiresAt = expiresAt;
        this.type = type;
    }

    // Getters & Setters
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
