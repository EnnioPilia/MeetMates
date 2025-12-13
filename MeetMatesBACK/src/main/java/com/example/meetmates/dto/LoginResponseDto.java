package com.example.meetmates.dto;

/**
 * DTO représentant la réponse envoyée après une tentative de connexion.
 * 
 * Contient un simple message permettant d'indiquer le résultat
 * de l'opération (succès ou erreur).
 */
public class LoginResponseDto {

    /** Message décrivant le résultat de la tentative de connexion. */
    private final String message;

    /**
     * Construit une réponse de connexion.
     * @param message message indiquant le résultat
     */
    public LoginResponseDto(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }
}
