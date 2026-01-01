package com.example.meetmates.common.exception;

/**
 * Exception personnalisée utilisée pour représenter une erreur fonctionnelle
 * liée à un {@link ErrorCode}. Cette exception est interceptée par le
 * GlobalExceptionHandler afin de produire une réponse API standardisée
 * avec un message localisé et un code associé.
 */
public class ApiException extends RuntimeException {

    private final ErrorCode errorCode;

    /**
     * Construit une nouvelle exception basée sur un code d'erreur.
     * Le message de l'exception utilise le nom du code.
     *
     * @param errorCode le code d'erreur associé à l'exception
     */
    public ApiException(ErrorCode errorCode) {
        super(errorCode.name());
        this.errorCode = errorCode;
    }

    /**
     * Retourne le code d'erreur qui a déclenché cette exception.
     *
     * @return le {@link ErrorCode} associé
     */
    public ErrorCode getErrorCode() {
        return errorCode;
    }
}
