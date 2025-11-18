package com.example.meetmates.exception;

import java.time.Instant;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.server.ResponseStatusException;

import com.example.meetmates.dto.ErrorDto;

import jakarta.servlet.http.HttpServletRequest;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // * Méthode utilitaire pour construire les réponses JSON
    private ResponseEntity<ErrorDto> build(HttpStatus status, String message) {

        String path = "unknown";

        var attributes = RequestContextHolder.getRequestAttributes();
        if (attributes instanceof ServletRequestAttributes servletAttributes) {
            HttpServletRequest request = servletAttributes.getRequest();
            if (request != null) {
                path = request.getRequestURI();
            }
        }

        return ResponseEntity.status(status).body(
                new ErrorDto(
                        Instant.now(),
                        status.value(),
                        status.getReasonPhrase(),
                        message,
                        path
                )
        );
    }

    // 404 – Utilisateur non trouvé
    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ErrorDto> handleUserNotFound(UserNotFoundException ex) {
        return build(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    // 403 – Compte désactivé / non validé
    @ExceptionHandler(UserDisabledException.class)
    public ResponseEntity<ErrorDto> handleUserDisabled(UserDisabledException ex) {
        return build(HttpStatus.FORBIDDEN, ex.getMessage());
    }

    // 409 – Email déjà utilisé
    @ExceptionHandler(EmailAlreadyUsedException.class)
    public ResponseEntity<ErrorDto> handleEmailAlreadyUsed(EmailAlreadyUsedException ex) {
        return build(HttpStatus.CONFLICT, ex.getMessage());
    }

    // 409 – Déjà participant
    @ExceptionHandler(AlreadyParticipantException.class)
    public ResponseEntity<ErrorDto> handleAlreadyParticipant(AlreadyParticipantException ex) {
        return build(HttpStatus.CONFLICT, ex.getMessage());
    }

    // 400 – Token invalide / expiré
    @ExceptionHandler(InvalidTokenException.class)
    public ResponseEntity<ErrorDto> handleInvalidToken(InvalidTokenException ex) {
        return build(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    // 400 – Mauvais arguments
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorDto> handleIllegalArgument(IllegalArgumentException ex) {
        return build(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    // 401 – Mauvais mot de passe
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorDto> handleBadCredentials(BadCredentialsException ex) {
        return build(HttpStatus.UNAUTHORIZED, "Mauvais mot de passe.");
    }

    // 404 – Événement introuvable
    @ExceptionHandler(EventNotFoundException.class)
    public ResponseEntity<ErrorDto> handleEventNotFound(EventNotFoundException ex) {
        return build(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    // 404 – Activité introuvable
    @ExceptionHandler(ActivityNotFoundException.class)
    public ResponseEntity<ErrorDto> handleActivityNotFound(ActivityNotFoundException ex) {
        return build(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    // 404 – Catégorie introuvable
    @ExceptionHandler(CategoryNotFoundException.class)
    public ResponseEntity<ErrorDto> handleCategoryNotFound(CategoryNotFoundException ex) {
        return build(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    // 404 – Adresse introuvable
    @ExceptionHandler(AddressNotFoundException.class)
    public ResponseEntity<ErrorDto> handleAddressNotFound(AddressNotFoundException ex) {
        return build(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    // 403 – Accès interdit à l’événement
    @ExceptionHandler(UnauthorizedEventAccessException.class)
    public ResponseEntity<ErrorDto> handleUnauthorized(UnauthorizedEventAccessException ex) {
        return build(HttpStatus.FORBIDDEN, ex.getMessage());
    }

    // 500 – Erreur d'envoi d'email
    @ExceptionHandler(EmailSendException.class)
    public ResponseEntity<ErrorDto> handleEmailSend(EmailSendException ex) {
        return build(HttpStatus.INTERNAL_SERVER_ERROR, ex.getMessage());
    }

    // 404 – Token non trouvé
    @ExceptionHandler(TokenNotFoundException.class)
    public ResponseEntity<ErrorDto> handleTokenNotFound(TokenNotFoundException ex) {
        return build(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    // 400 – Token expiré
    @ExceptionHandler(TokenExpiredException.class)
    public ResponseEntity<ErrorDto> handleTokenExpired(TokenExpiredException ex) {
        return build(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    // 400 – Token déjà utilisé
    @ExceptionHandler(TokenAlreadyUsedException.class)
    public ResponseEntity<ErrorDto> handleTokenAlreadyUsed(TokenAlreadyUsedException ex) {
        return build(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    // 409 – Utilisateur déjà vérifié
    @ExceptionHandler(UserAlreadyVerifiedException.class)
    public ResponseEntity<ErrorDto> handleUserAlreadyVerified(UserAlreadyVerifiedException ex) {
        return build(HttpStatus.CONFLICT, ex.getMessage());
    }

    // Exceptions Spring Security encapsulées
    @ExceptionHandler(InternalAuthenticationServiceException.class)
    public ResponseEntity<ErrorDto> handleInternalAuth(InternalAuthenticationServiceException ex) {
        Throwable cause = ex.getCause();
        if (cause instanceof UserNotFoundException unf) {
            return build(HttpStatus.NOT_FOUND, unf.getMessage());
        }
        return build(HttpStatus.INTERNAL_SERVER_ERROR, ex.getMessage());
    }

    // Pour capter ResponseStatusException que Spring lance parfois
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ErrorDto> handleResponseStatus(ResponseStatusException ex) {
        HttpStatus status = HttpStatus.resolve(ex.getStatusCode().value());
        return build(status != null ? status : HttpStatus.INTERNAL_SERVER_ERROR, ex.getReason());
    }

    // 500 – fallback générique
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorDto> handleRuntime(RuntimeException ex) {
        return build(HttpStatus.INTERNAL_SERVER_ERROR, ex.getMessage());
    }
}
