package com.example.meetmates.exception;

import java.time.Instant;
import java.util.Locale;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.server.ResponseStatusException;

import com.example.meetmates.dto.ErrorDto;

import jakarta.servlet.http.HttpServletRequest;

/**
 * Gestionnaire global des exceptions pour l'application.
 * Centralise la capture des erreurs afin de produire une réponse JSON standardisée
 * contenant la date, le code HTTP, le message localisé et le chemin de la requête.
 *
 * Ce handler intercepte :
 * - les exceptions métier {@link ApiException}
 * - les exceptions Spring Security (401, 403)
 * - les erreurs génériques Spring (ResponseStatusException)
 * - les erreurs de validation (MethodArgumentNotValidException)
 * - toutes les erreurs Runtime en fallback
 *
 * Les messages d'erreur renvoyés sont automatiquement récupérés depuis le fichier messages.properties via {@link MessageSource}.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    @Autowired
    private MessageSource messageSource;

    /**
     * Construit une réponse d'erreur standardisée à partir d'un statut HTTP et d'un code message.
     * Le code est utilisé pour récupérer le message localisé dans messages.properties.
     *
     * @param status le statut HTTP renvoyé au client
     * @param code le code du message d'erreur (clé du fichier messages.properties)
     * @return un {@link ResponseEntity} contenant un {@link ErrorDto}
     */
    private ResponseEntity<ErrorDto> build(HttpStatus status, String code) {
        String message = messageSource.getMessage(code, null, Locale.getDefault());
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

    /**
     * Gestion des exceptions métier personnalisées {@link ApiException}.
     * Renvoie systématiquement un HTTP 404 afin de masquer les différences de statut.
     *
     * @param ex l'exception métier déclenchée
     * @return une réponse d'erreur formatée
     */
    @ExceptionHandler(ApiException.class)
    public ResponseEntity<ErrorDto> handleNotFound(ApiException ex) {
        return build(HttpStatus.NOT_FOUND, ex.getErrorCode().name());
    }

    /**
     * Gestion des erreurs d'authentification lorsque le mot de passe est incorrect.
     *
     * @param ex l'exception Spring Security
     * @return une réponse HTTP 401 Unauthorized
     */
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorDto> handleBadCredentials(BadCredentialsException ex) {
        return build(HttpStatus.UNAUTHORIZED, ErrorCode.AUTH_BAD_PASSWORD.name());
    }

    /**
     * Gestion des exceptions génériques Spring pouvant contenir un statut personnalisé.
     *
     * @param ex l'exception représentant une erreur HTTP
     * @return une réponse avec le statut contenu dans l'exception
     */
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ErrorDto> handleResponseStatus(ResponseStatusException ex) {
        HttpStatus status = HttpStatus.resolve(ex.getStatusCode().value());
        return build(status != null ? status : HttpStatus.INTERNAL_SERVER_ERROR,
                ex.getReason());
    }

    /**
     * Fallback global pour toutes les erreurs Runtime non capturées ailleurs.
     * Renvoie une erreur HTTP 500 avec un message générique.
     *
     * @param ex l'exception levée
     * @return une réponse HTTP 500 Internal Server Error
     */
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorDto> handleRuntime(RuntimeException ex) {
        return build(HttpStatus.INTERNAL_SERVER_ERROR, "INTERNAL.ERROR");
    }

    /**
     * Gestion des erreurs d'autorisation lorsque l'utilisateur n'a pas les droits
     * pour accéder à une ressource (403 Forbidden).
     *
     * @param ex exception de Spring Security
     * @return une réponse 403 Forbidden
     */
    @ExceptionHandler(AuthorizationDeniedException.class)
    public ResponseEntity<ErrorDto> handleAuthorizationDenied(AuthorizationDeniedException ex) {
        return build(HttpStatus.FORBIDDEN, "EVENT_FORBIDDEN");
    }

    /**
     * Gestion des cas où l'accès est explicitement interdit par Spring Security.
     *
     * @param ex exception Spring Security
     * @return une réponse 403 Forbidden
     */
    @ExceptionHandler(AccessDeniedException.class) 
    public ResponseEntity<ErrorDto> handleAccessDenied(AccessDeniedException ex) {
        return build(HttpStatus.FORBIDDEN, "EVENT_FORBIDDEN");
    }

    /**
     * Gestion des erreurs de validation des DTOs (annotations @Valid).
     * Renvoie uniquement le message de la première erreur détectée.
     *
     * @param ex exception contenant les erreurs de validation
     * @return une réponse 400 Bad Request avec message personnalisé
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorDto> handleValidationErrors(MethodArgumentNotValidException ex) {
        String defaultMessage = ex.getBindingResult().getFieldError().getDefaultMessage();
        return ResponseEntity.badRequest().body(
                new ErrorDto(
                        Instant.now(),
                        HttpStatus.BAD_REQUEST.value(),
                        "Bad Request",
                        defaultMessage,
                        ""
                )
        );
    }

}
