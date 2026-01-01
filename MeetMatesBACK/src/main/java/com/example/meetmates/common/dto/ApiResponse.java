package com.example.meetmates.common.dto;

/**
 * Représente une réponse standardisée de l'API.
 * 
 * Cette classe permet d'uniformiser les réponses envoyées par le serveur, 
 * en contenant un message d'information ainsi qu'éventuellement des données.
 * 
 * @param <T> Le type des données renvoyées dans la réponse.
 */
public class ApiResponse<T> {

    /** Message décrivant l'état ou le résultat de la requête. */
    private final String message;

    /** Données renvoyées par l'API (peuvent être null si aucune donnée n'est fournie). */
    private final T data;

    /** Construit une réponse API contenant un message et des données.
     * @param message Message décrivant le résultat de l'opération.
     * @param data    Données renvoyées par l'API (peut être null).
     */
    public ApiResponse(String message, T data) {
        this.message = message;
        this.data = data;
    }

    /** Construit une réponse API ne contenant qu'un message.
     * Les données seront automatiquement définies à {@code null}.
     * @param message Message décrivant le résultat de l'opération.
     */
    public ApiResponse(String message) {
        this(message, null);
    }

    public String getMessage() {return message;}
    public T getData() {return data;}
}
