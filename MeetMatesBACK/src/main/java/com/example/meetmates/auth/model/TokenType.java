package com.example.meetmates.auth.model;

/**
 * Types de jetons (tokens) utilisés dans le système.
 *
 * Chaque type a une finalité spécifique :
 * - {@code REFRESH} : token permettant de générer un nouveau token d'accès (JWT Refresh Token).
 * - {@code PASSWORD_RESET} : token envoyé lors d'une demande de réinitialisation de mot de passe.
 * - {@code VERIFICATION} : token utilisé pour valider l'adresse email d'un utilisateur.
 *
 * Le type permet de distinguer les logiques métier associées à chaque token.
 */
public enum TokenType {
    REFRESH,
    PASSWORD_RESET,
    VERIFICATION
}
