package com.example.meetmates.user.model;

/**
 * Statut global d’un utilisateur dans la plateforme.
 *
 * Ce statut permet principalement de gérer l’accès du compte :
 * - {@code ACTIVE} : l’utilisateur peut utiliser pleinement la plateforme.
 * - {@code BANNED} : l’utilisateur est banni et ne peut plus se connecter ni interagir.
 * - {@code DELETED} : l’utilisateur a supprimé son compte ou a été supprimé par un admin.
 *
 * Le statut est utile pour contrôler la visibilité, l’accès, et la gestion interne des comptes.
 */
public enum UserStatus {
    ACTIVE,
    BANNED,
    DELETED
}
