package com.example.meetmates.exception;

/**
 * Regroupe l'ensemble des codes d'erreurs utilisés dans l'application.
 * Chaque valeur correspond à un type d'erreur fonctionnelle ou technique,
 * permettant une gestion uniforme dans les exceptions, les réponses API
 * et les messages localisés du fichier messages.properties.
 */
public enum ErrorCode {
    
    // Authentification  
    AUTH_BAD_PASSWORD,
    AUTH_UNAUTHORIZED,
    
    // Tokens
    TOKEN_INVALID,
    TOKEN_EXPIRED,
    TOKEN_NOT_FOUND,

    // Utilisateurs
    USER_NOT_FOUND,
    USER_BANNED,
    USER_DISABLED,
    USER_DELETED,
    USER_EMAIL_USED,
    USER_ALREADY_VERIFIED,
    EMAIL_SEND_FAILED,
    ADDRESS_NOT_FOUND,

    // Activités et catégories
    ACTIVITY_NOT_FOUND,
    CATEGORY_NOT_FOUND,

    // Événements
    EVENT_NOT_FOUND,
    EVENT_FULL,
    EVENT_ALREADY_PARTICIPANT,
    EVENT_PENDING_ALREADY,
    EVENT_REQUEST_REJECTED,
    EVENT_FORBIDDEN,
    EVENT_INVALID_STATUS,
    EVENT_ORGANIZER_CANNOT_BE_REMOVED,

    // Participants
    PARTICIPANT_NOT_FOUND,
    
    // Fichiers / images
    INVALID_FILE,
    FILE_TOO_LARGE,
    INVALID_FILE_TYPE
}
