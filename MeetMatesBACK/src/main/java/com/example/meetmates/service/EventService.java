package com.example.meetmates.service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.example.meetmates.dto.EventRequest;
import com.example.meetmates.dto.EventResponse;
import com.example.meetmates.model.core.Address;
import com.example.meetmates.model.core.Event;
import com.example.meetmates.model.core.EventUser;
import com.example.meetmates.model.core.User;
import com.example.meetmates.repository.ActivityRepository;
import com.example.meetmates.repository.AddressRepository;
import com.example.meetmates.repository.EventRepository;
import com.example.meetmates.repository.EventUserRepository;
import com.example.meetmates.repository.UserRepository;

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final ActivityRepository activityRepository;
    private final AddressRepository addressRepository;
    private final UserRepository userRepository;
    private final EventUserRepository eventUserRepository;

    public EventService(EventRepository eventRepository,
            ActivityRepository activityRepository,
            AddressRepository addressRepository,
            UserRepository userRepository,
            EventUserRepository eventUserRepository) {
        this.eventRepository = eventRepository;
        this.activityRepository = activityRepository;
        this.addressRepository = addressRepository;
        this.userRepository = userRepository;
        this.eventUserRepository = eventUserRepository;
    }

    // 🔹 Conversion Event -> EventResponse
    private EventResponse toResponse(Event e) {
        // Récupérer le nom de l’organisateur
        String organizerName = e.getParticipants().stream()
                .filter(p -> p.getRole() == EventUser.ParticipantRole.ORGANIZER)
                .findFirst()
                .map(p -> p.getUser().getFirstName() + " " + p.getUser().getLastName())
                .orElse("Inconnu");

        // Liste des participants (hors organisateur)
        List<String> participantNames = e.getParticipants().stream()
                .filter(p -> p.getRole() == EventUser.ParticipantRole.PARTICIPANT)
                .map(p -> p.getUser().getFirstName() + " " + p.getUser().getLastName())
                .collect(Collectors.toList());

        return new EventResponse(
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
                e.getActivity() != null ? e.getActivity().getName() : null,
                e.getAddress() != null ? e.getAddress().getFullAddress() : null,
                organizerName,
                participantNames
        );
    }

    // 🔹 Retourne tous les événements au format DTO
    public List<EventResponse> findAllResponses() {
        return eventRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // 🔹 Retourne un événement unique au format DTO
    public EventResponse findResponseById(UUID id) {
        return eventRepository.findById(id)
                .map(this::toResponse)
                .orElse(null);
    }

    // 🔹 Supprimer un événement
    public void delete(UUID id) {
        eventRepository.deleteById(id);
    }

    public List<Event> getEventsByActivity(UUID activityId) {
        return eventRepository.findByActivityId(activityId);
    }

    // 🔹 Créer un événement
    public EventResponse createEvent(EventRequest req) {
        // 1️⃣ Récupération du user connecté
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();
        User organizer = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        // 2️⃣ Vérification activité
        var activity = activityRepository.findById(req.getActivityId())
                .orElseThrow(() -> new RuntimeException("Activité introuvable"));

        // 3️⃣ Vérification adresse
        if (req.getAddress() == null) {
            throw new IllegalArgumentException("Adresse requise");
        }
        Address address = addressRepository.save(req.getAddress());

        // 4️⃣ Création de l'événement
        Event event = new Event();
        event.setTitle(req.getTitle());
        event.setDescription(req.getDescription());
        event.setEventDate(req.getEventDate());
        event.setStartTime(req.getStartTime());
        event.setEndTime(req.getEndTime());
        event.setMaxParticipants(req.getMaxParticipants());
        event.setStatus(req.getStatus());
        event.setMaterial(req.getMaterial());
        event.setLevel(req.getLevel());
        event.setActivity(activity);
        event.setAddress(address);

        Event savedEvent = eventRepository.save(event);

        // 5️⃣ Création de la relation EventUser (organisateur)
        EventUser organizerLink = new EventUser();
        organizerLink.setEvent(savedEvent);
        organizerLink.setUser(organizer);
        organizerLink.setRole(EventUser.ParticipantRole.ORGANIZER);

        eventUserRepository.save(organizerLink);

        // 6️⃣ Rafraîchir les participants de l’événement (pour la réponse)
        savedEvent.getParticipants().add(organizerLink);

        return toResponse(savedEvent);
    }
}
