package com.example.meetmates.security;

import java.util.UUID;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import com.example.meetmates.model.EventUser.ParticipantRole;
import com.example.meetmates.model.User;
import com.example.meetmates.repository.EventUserRepository;
import com.example.meetmates.repository.UserRepository;

import lombok.RequiredArgsConstructor;

/**
 * Composant utilisé par Spring Security pour vérifier si l'utilisateur
 * actuellement authentifié possède les droits d'organisateur sur un événement.
 * 
 * Les méthodes de cette classe sont appelées via des expressions SpEL dans les annotations @PreAuthorize.
 * 
 * Exemple : @PreAuthorize("@eventSecurity.isOrganizer(#eventId)")
 */
@Component("eventSecurity")
@RequiredArgsConstructor
public class EventSecurity {

    private final EventUserRepository eventUserRepository;
    private final UserRepository userRepository;

    /**
     * Vérifie si l'utilisateur actuellement authentifié est l'organisateur
     * de l'événement correspondant à l'ID donné.
     *
     * @param eventId l'identifiant de l'événement
     * @return true si l'utilisateur est l'organisateur, sinon false
     */
    public boolean isOrganizer(UUID eventId) {

        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return false;
        }

        return eventUserRepository
                .findByEventIdAndUserId(eventId, user.getId())
                .map(eu -> eu.getRole() == ParticipantRole.ORGANIZER)
                .orElse(false);
    }

    /**
     * Vérifie si l'utilisateur actuellement authentifié est l'organisateur de l'événement lié à l'entrée EventUser donnée.
     *
     * Méthode utile lorsque seul un eventUserId est disponible,
     *  par exemple lors de l'acceptation ou du rejet d'une demande de participation.
     *
     * @param eventUserId l'identifiant d'une entrée EventUser
     * @return true si l'utilisateur est l'organisateur, sinon false
     */
    public boolean isOrganizerByEventUserId(UUID eventUserId) {
        
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return false;
        }

        var eu = eventUserRepository.findById(eventUserId).orElse(null);
        if (eu == null) {
            return false;
        }

        return eventUserRepository
                .findByEventIdAndUserId(eu.getEvent().getId(), user.getId())
                .map(link -> link.getRole() == ParticipantRole.ORGANIZER)
                .orElse(false);
    }

}
