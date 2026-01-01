package com.example.meetmates.user.model;

/**
 * Rôles possibles attribués à un utilisateur.
 *
 * Les rôles déterminent les permissions et accès à certaines fonctionnalités :
 * - {@code USER} : utilisateur standard, permissions de base.
 * - {@code MODERATOR} : utilisateur avec des droits de modération (événements, contenus).
 * - {@code ADMIN} : administrateur avec des droits complets sur la plateforme.
 *
 * Ce rôle peut être utilisé dans Spring Security ou dans des règles d'accès internes.
 */
public enum UserRole {
    USER,
    MODERATOR,
    ADMIN
}
