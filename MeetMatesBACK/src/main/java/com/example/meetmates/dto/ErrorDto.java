package com.example.meetmates.dto;

import java.time.Instant;

/**
 * DTO représentant une erreur renvoyée par l'API.
 *
 * Ce record permet d'uniformiser la structure des réponses d'erreur afin
 * d'assurer une meilleure lisibilité côté client, lors d'exceptions ou de problèmes de traitement.
 *
 * @param timestamp date et heure de l'erreur (format UTC)
 * @param status code HTTP associé à l'erreur (ex. : 400, 404, 500)
 * @param error nom ou type de l'erreur (ex. : "Bad Request", "Not Found")
 * @param message message détaillé décrivant l'erreur
 * @param path chemin de l'endpoint où l'erreur s'est produite
 */
public record ErrorDto(
        Instant timestamp,
        int status,
        String error,
        String message,
        String path
) {}
