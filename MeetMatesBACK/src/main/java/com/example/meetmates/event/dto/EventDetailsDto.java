package com.example.meetmates.event.dto;

import java.util.List;
import java.util.UUID;

import com.example.meetmates.address.dto.AddressDto;

/**
 * DTO représentant les informations détaillées d'un événement.
 *
 * Ce record regroupe toutes les données utiles à l'affichage complet
 * d'un événement, incluant les informations générales, l'adresse,
 * l’activité, l’organisateur ainsi que la liste des participants
 * classés par statut.
 *
 * @param id identifiant unique de l’événement
 * @param title titre de l’événement
 * @param description description complète de l’événement
 * @param eventDate date de l’événement au format ISO (ex: 2025-03-21)
 * @param startTime heure de début (format HH:mm)
 * @param endTime heure de fin (format HH:mm)
 * @param address adresse complète de l’événement
 * @param activityName nom de l’activité associée
 * @param organizerName nom complet de l’organisateur de l’événement
 * @param level niveau de difficulté de l’événement
 * @param material indication sur le matériel requis
 * @param status statut actuel de l’événement
 * @param maxParticipants nombre maximal de participants autorisés
 * @param participationStatus statut de participation de l’utilisateur courant
 * @param acceptedParticipants liste des participants acceptés
 * @param pendingParticipants liste des participants en attente de validation
 * @param rejectedParticipants liste des participants refusés
 */
public record EventDetailsDto(
        UUID id,
        String title,
        String description,
        String eventDate,
        String startTime,
        String endTime,
        AddressDto address,
        String activityName,
        String organizerName,
        String level,
        String material,
        String status,
        Integer maxParticipants,
        String participationStatus,
        List<EventUserDto> acceptedParticipants,
        List<EventUserDto> pendingParticipants,
        List<EventUserDto> rejectedParticipants
) {}
