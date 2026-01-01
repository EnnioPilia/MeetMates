package com.example.meetmates.event.dto;

import java.util.UUID;

import com.example.meetmates.address.dto.AddressDto;

/**
 * DTO représentant la participation d'un utilisateur à un événement.
 *
 * Ce record combine des informations provenant de plusieurs entités
 * (événement, utilisateur, adresse…) afin de fournir une vue complète
 * et prête à l'affichage pour le front-end.
 *
 * @param id identifiant unique de la participation
 * @param eventId identifiant de l'événement concerné
 * @param eventTitle titre de l'événement
 * @param eventDescription description de l'événement
 * @param userId identifiant de l'utilisateur participant
 * @param firstName prénom de l'utilisateur
 * @param lastName nom de l'utilisateur
 * @param email adresse email de l'utilisateur
 * @param role rôle de l'utilisateur dans l'événement ("ORGANIZER", "PARTICIPANT")
 * @param participationStatus statut de participation de l'utilisateur
 * @param joinedAt date/heure d'inscription à l'événement
 * @param eventStatus statut global de l'événement ("OPEN", "FULL", "CANCELLED", "FINISHED")
 * @param eventDate date de l'événement
 * @param address adresse complète de l'événement
 * @param activityName nom de l'activité associée à l'événement
 */
public record EventUserDto(
        UUID id,
        UUID eventId,
        String eventTitle,
        String eventDescription,
        UUID userId,
        String firstName,
        String lastName,
        String email,
        String role,
        String participationStatus,
        String joinedAt,
        String eventStatus,
        String eventDate,
        AddressDto address,
        String activityName
) {}
