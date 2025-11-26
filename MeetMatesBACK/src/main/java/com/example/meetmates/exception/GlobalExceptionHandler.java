package com.example.meetmates.exception;

import java.time.Instant;
import java.util.Locale;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.NoHandlerFoundException;

import com.example.meetmates.dto.ErrorDto;

import jakarta.servlet.http.HttpServletRequest;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @Autowired
    private MessageSource messageSource;

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

    // ---- Exceptions Métier ----
    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<ErrorDto> handleNotFound(NotFoundException ex) {
        return build(HttpStatus.NOT_FOUND, ex.getErrorCode().name());
    }

    @ExceptionHandler(ConflictException.class)
    public ResponseEntity<ErrorDto> handleConflict(ConflictException ex) {
        return build(HttpStatus.CONFLICT, ex.getErrorCode().name());
    }

    @ExceptionHandler(ForbiddenException.class)
    public ResponseEntity<ErrorDto> handleForbidden(ForbiddenException ex) {
        return build(HttpStatus.FORBIDDEN, ex.getErrorCode().name());
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ErrorDto> handleUnauthorized(UnauthorizedException ex) {
        return build(HttpStatus.UNAUTHORIZED, ex.getErrorCode().name());
    }

    // ---- Spring Security ----
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorDto> handleBadCredentials(BadCredentialsException ex) {
        return build(HttpStatus.UNAUTHORIZED, ErrorCode.AUTH_BAD_PASSWORD.name());
    }

    @ExceptionHandler(InternalAuthenticationServiceException.class)
    public ResponseEntity<ErrorDto> handleInternalAuth(InternalAuthenticationServiceException ex) {
        return build(HttpStatus.UNAUTHORIZED, ErrorCode.AUTH_UNAUTHORIZED.name());
    }

    // ---- Exceptions Spring génériques ----
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ErrorDto> handleResponseStatus(ResponseStatusException ex) {
        HttpStatus status = HttpStatus.resolve(ex.getStatusCode().value());
        return build(status != null ? status : HttpStatus.INTERNAL_SERVER_ERROR,
                ex.getReason());
    }

    // ---- Fallback ----
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorDto> handleRuntime(RuntimeException ex) {
        return build(HttpStatus.INTERNAL_SERVER_ERROR, "internal.error");
    }

    @ExceptionHandler(NoHandlerFoundException.class)
    public ResponseEntity<ErrorDto> handleNoHandlerFound(NoHandlerFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ErrorDto(
                        Instant.now(),
                        HttpStatus.NOT_FOUND.value(),
                        HttpStatus.NOT_FOUND.getReasonPhrase(),
                        "La ressource demandée n'existe pas",
                        ex.getRequestURL()
                ));
    }
}
