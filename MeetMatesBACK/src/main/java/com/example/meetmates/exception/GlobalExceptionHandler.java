package com.example.meetmates.exception;

import java.time.Instant;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // * Méthode utilitaire pour construire les réponses JSON
    private ResponseEntity<Object> build(HttpStatus status, String message) {
        return ResponseEntity.status(status).body(
                Map.of(
                        "timestamp", Instant.now().toString(),
                        "status", status.value(),
                        "error", status.getReasonPhrase(),
                        "message", message
                )
        );
    }

    // 404 – Utilisateur non trouvé
    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<Object> handleUserNotFound(UserNotFoundException ex) {
        return build(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    // 403 – Compte désactivé / non validé
    @ExceptionHandler(UserDisabledException.class)
    public ResponseEntity<Object> handleUserDisabled(UserDisabledException ex) {
        return build(HttpStatus.FORBIDDEN, ex.getMessage());
    }

    // 409 – Email déjà utilisé
    @ExceptionHandler(EmailAlreadyUsedException.class)
    public ResponseEntity<Object> handleEmailAlreadyUsed(EmailAlreadyUsedException ex) {
        return build(HttpStatus.CONFLICT, ex.getMessage());
    }

    // 409 – Déjà participant
    @ExceptionHandler(AlreadyParticipantException.class)
    public ResponseEntity<Object> handleAlreadyParticipant(AlreadyParticipantException ex) {
        return build(HttpStatus.CONFLICT, ex.getMessage());
    }

    // 400 – Token invalide / expiré
    @ExceptionHandler(InvalidTokenException.class)
    public ResponseEntity<Object> handleInvalidToken(InvalidTokenException ex) {
        return build(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    // 400 – Mauvais arguments
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Object> handleIllegalArgument(IllegalArgumentException ex) {
        return build(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    // 401 – Mauvais mot de passe
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Object> handleBadCredentials(BadCredentialsException ex) {
        return build(HttpStatus.UNAUTHORIZED, "Mauvais mot de passe.");
    }

    // 404 – Événement introuvable
    @ExceptionHandler(EventNotFoundException.class)
    public ResponseEntity<Object> handleEventNotFound(EventNotFoundException ex) {
        return build(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    // 404 – Activité introuvable
    @ExceptionHandler(ActivityNotFoundException.class)
    public ResponseEntity<Object> handleActivityNotFound(ActivityNotFoundException ex) {
        return build(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    // 404 – Catégorie introuvable
    @ExceptionHandler(CategoryNotFoundException.class)
    public ResponseEntity<Object> handleCategoryNotFound(CategoryNotFoundException ex) {
        return build(HttpStatus.NOT_FOUND, ex.getMessage());
    }
    
    // 404 – Adresse introuvable
    @ExceptionHandler(AddressNotFoundException.class)
    public ResponseEntity<Object> handleAddressNotFound(AddressNotFoundException ex) {
        return build(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    // 403 – Accès interdit à l’événement
    @ExceptionHandler(UnauthorizedEventAccessException.class)
    public ResponseEntity<Object> handleUnauthorized(UnauthorizedEventAccessException ex) {
        return build(HttpStatus.FORBIDDEN, ex.getMessage());
    }

    // 500 – Erreur d'envoi d'email
    @ExceptionHandler(EmailSendException.class)
    public ResponseEntity<Object> handleEmailSend(EmailSendException ex) {
        return build(HttpStatus.INTERNAL_SERVER_ERROR, ex.getMessage());
    }

    // 404 – Token non trouvé
    @ExceptionHandler(TokenNotFoundException.class)
    public ResponseEntity<Object> handleTokenNotFound(TokenNotFoundException ex) {
        return build(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    // 400 – Token expiré
    @ExceptionHandler(TokenExpiredException.class)
    public ResponseEntity<Object> handleTokenExpired(TokenExpiredException ex) {
        return build(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    // 400 – Token déjà utilisé
    @ExceptionHandler(TokenAlreadyUsedException.class)
    public ResponseEntity<Object> handleTokenAlreadyUsed(TokenAlreadyUsedException ex) {
        return build(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    // 409 – Utilisateur déjà vérifié
    @ExceptionHandler(UserAlreadyVerifiedException.class)
    public ResponseEntity<Object> handleUserAlreadyVerified(UserAlreadyVerifiedException ex) {
        return build(HttpStatus.CONFLICT, ex.getMessage());
    }

    // Exceptions Spring Security encapsulées
    @ExceptionHandler(InternalAuthenticationServiceException.class)
    public ResponseEntity<Object> handleInternalAuth(InternalAuthenticationServiceException ex) {
        Throwable cause = ex.getCause();
        if (cause instanceof UserNotFoundException unf) {
            return build(HttpStatus.NOT_FOUND, unf.getMessage());
        }
        return build(HttpStatus.INTERNAL_SERVER_ERROR, ex.getMessage());
    }

    // Pour capter ResponseStatusException que Spring lance parfois
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Object> handleResponseStatus(ResponseStatusException ex) {
        HttpStatus status = HttpStatus.resolve(ex.getStatusCode().value());
        return build(status != null ? status : HttpStatus.INTERNAL_SERVER_ERROR, ex.getReason());
    }

    // 500 – fallback générique
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Object> handleRuntime(RuntimeException ex) {
        return build(HttpStatus.INTERNAL_SERVER_ERROR, ex.getMessage());
    }
}
