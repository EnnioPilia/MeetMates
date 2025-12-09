package com.example.meetmates.mapper;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.example.meetmates.dto.EventResponseDto;
import com.example.meetmates.dto.EventUserDto;
import com.example.meetmates.model.Event;
import com.example.meetmates.model.EventUser;
import com.example.meetmates.model.User;

/**
 * Mapper responsable de la conversion des entités {@link Event} et {@link EventUser}
 * vers leurs DTOs {@link EventResponseDto} et {@link EventUserDto}.
 *
 * Les mappers permettent de séparer les entités JPA internes des objets exposés via l'API.
 */
@Component
public class EventMapper {

    /**
     * Convertit une entité {@link Event} en un {@link EventResponseDto}.
     * Cette méthode extrait également :
     * - l'organisateur de l'événement,
     * - son nom complet,
     * - la liste des noms des participants.
     *
     * @param e l'événement à convertir
     * @return un DTO contenant les informations publiques d'un événement
     */
    public EventResponseDto toResponse(Event e) {

        var organizerOpt = e.getParticipants().stream()
                .filter(p -> p.getRole() == EventUser.ParticipantRole.ORGANIZER)
                .findFirst();

        UUID organizerId = organizerOpt
                .map(p -> p.getUser().getId())
                .orElse(null);

        String organizerName = organizerOpt
                .map(p -> p.getUser().getFirstName() + " " + p.getUser().getLastName())
                .orElse("Inconnu");

        List<String> participantNames = e.getParticipants().stream()
                .filter(p -> p.getRole() == EventUser.ParticipantRole.PARTICIPANT)
                .map(p -> p.getUser().getFirstName() + " " + p.getUser().getLastName())
                .collect(Collectors.toList());

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
                e.getActivity() != null ? e.getActivity().getId() : null,
                e.getActivity() != null ? e.getActivity().getName() : null,
                AddressMapper.toDto(e.getAddress()),
                organizerId,
                organizerName,
                participantNames
        );
    }

    /**
     * Convertit une entité {@link EventUser} en un {@link EventUserDto}.
     *
     * Ce mapper extrait :
     * - les informations principales de l'événement,
     * - les informations de l'utilisateur lié,
     * - le rôle et le statut de participation,
     * - les informations d'adresse et d'activité associées.
     *
     * @param eu l'association événement-utilisateur à convertir
     * @return un DTO contenant les informations complètes d'un lien Event/User
     */
    public EventUserDto EventUserDto(EventUser eu) {
        Event event = eu.getEvent();
        User user = eu.getUser();

        return new EventUserDto(
                eu.getId(),
                event.getId(),
                event.getTitle(),
                event.getDescription(),
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                eu.getRole().name(),
                eu.getParticipationStatus().name(),
                eu.getJoinedAt() != null ? eu.getJoinedAt().toString() : null,
                event.getStatus().name(),
                event.getEventDate().toString(),
                AddressMapper.toDto(event.getAddress()),
                event.getActivity() != null ? event.getActivity().getName() : null
        );
    }
}
