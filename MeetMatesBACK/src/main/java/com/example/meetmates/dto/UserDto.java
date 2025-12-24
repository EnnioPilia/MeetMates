package com.example.meetmates.dto;

import java.util.UUID;

/**
 * DTO représentant un utilisateur dans l'application.
 *
 * Ce record est utilisé pour exposer uniquement les informations publiques
 * et nécessaires d'un utilisateur, sans révéler l'entité complète ni ses éléments sensibles.
 *
 * @param id identifiant unique de l'utilisateur
 * @param firstName prénom de l'utilisateur
 * @param lastName nom de l'utilisateur
 * @param email adresse email de l'utilisateur
 * @param age âge de l'utilisateur
 * @param city ville de résidence de l'utilisateur
 * @param profilePictureUrl URL de la photo de profil de l'utilisateur
 * @param role Role de l'utilisateur ADMIN ou USER
 */
public record UserDto(
        UUID id,
        String firstName,
        String lastName,
        String email,
        Integer age,
        String city,
        String profilePictureUrl,
        String role
) {}
