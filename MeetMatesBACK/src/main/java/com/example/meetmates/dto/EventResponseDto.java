package com.example.meetmates.dto;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import com.example.meetmates.mapper.AddressMapper;
import com.example.meetmates.model.Event;
import com.example.meetmates.model.Event.EventStatus;
import com.example.meetmates.model.Event.Level;
import com.example.meetmates.model.Event.MaterialOption;
import com.example.meetmates.model.EventUser.ParticipantRole;

/**
 * DTO représentant un événement avec l'ensemble des informations nécessaires pour être exposé à l'API.
 *
 * Ce record assemble les données d'un événement, de son organisateur,
 * de son activité, de son adresse et de ses participants.
 *
 * @param id identifiant unique de l'événement
 * @param title titre de l'événement
 * @param description description détaillée de l'événement
 * @param eventDate date à laquelle se déroulera l'événement
 * @param startTime heure de début
 * @param endTime heure de fin
 * @param maxParticipants nombre maximal de participants
 * @param status statut actuel de l'événement (UPCOMING, CANCELLED, FINISHED, etc.)
 * @param material indication concernant le matériel nécessaire
 * @param level niveau de difficulté de l’événement
 * @param activityId identifiant de l'activité associée
 * @param activityName nom de l'activité
 * @param address adresse complète de l'événement
 * @param organizerId identifiant de l'organisateur de l'événement
 * @param organizerName nom complet de l'organisateur
 * @param participantNames liste des noms des participants
 */
public record EventResponseDto(
        UUID id,
        String title,
        String description,
        LocalDate eventDate,
        LocalTime startTime,
        LocalTime endTime,
        Integer maxParticipants,
        EventStatus status,
        MaterialOption material,
        Level level,
        UUID activityId,
        String activityName,
        AddressDto address,
        UUID organizerId,
        String organizerName,
        List<String> participantNames
) {

    /**
     * Convertit une entité {@link Event} en {@link EventResponseDto}.
     *
     * Cette méthode effectue :
     *  -La récupération de l'organisateur
     *  -La liste des participants
     *  -La conversion de l'adresse via {@link AddressMapper}
     *  -La récupération des informations de l'activité
     *
     * @param e l'entité Event à convertir
     * @return une instance de EventResponseDto ou {@code null} si l'événement est nul
     */
    public static EventResponseDto from(Event e) {
        if (e == null) return null;

        // --- Récupération de l'organisateur ---
        var organizerOpt = e.getParticipants().stream()
                .filter(p -> p.getRole() == ParticipantRole.ORGANIZER)
                .findFirst();

        UUID organizerId = organizerOpt
                .map(p -> p.getUser().getId())
                .orElse(null);

        String organizerName = organizerOpt
                .map(p -> p.getUser().getFirstName() + " " + p.getUser().getLastName())
                .orElse("Inconnu");

        // --- Récupération des participants ---
        List<String> participantNames = e.getParticipants().stream()
                .filter(p -> p.getRole() == ParticipantRole.PARTICIPANT)
                .map(p -> p.getUser().getFirstName() + " " + p.getUser().getLastName())
                .collect(Collectors.toList());

        // --- Activité ---
        UUID activityId = e.getActivity() != null ? e.getActivity().getId() : null;
        String activityName = e.getActivity() != null ? e.getActivity().getName() : null;

        // --- Adresse ---
        AddressDto addressDto = e.getAddress() != null ? AddressMapper.toDto(e.getAddress()) : null;

        // Construction finale du DTO
        return new EventResponseDto(
                e.getId(),
                e.getTitle(),
                e.getDescription(),
                e.getEventDate(),
                e.getStartTime(),
                e.getEndTime(),
                e.getMaxParticipants(),
                e.getStatus(),
                e.getMaterial(),
                e.getLevel(),
                activityId,
                activityName,
                addressDto,
                organizerId,
                organizerName,
                participantNames
        );
    }
}
