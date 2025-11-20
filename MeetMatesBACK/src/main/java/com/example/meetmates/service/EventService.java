package com.example.meetmates.service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.meetmates.dto.EventDetailsDto;
import com.example.meetmates.dto.EventRequestDto;
import com.example.meetmates.dto.EventResponseDto;
import com.example.meetmates.dto.EventUserDto;
import com.example.meetmates.exception.ActivityNotFoundException;
import com.example.meetmates.exception.EventNotFoundException;
import com.example.meetmates.exception.UnauthorizedEventAccessException;
import com.example.meetmates.mapper.EventMapper;
import com.example.meetmates.model.Address;
import com.example.meetmates.model.Event;
import com.example.meetmates.model.EventUser;
import com.example.meetmates.model.User;
import com.example.meetmates.repository.ActivityRepository;
import com.example.meetmates.repository.AddressRepository;
import com.example.meetmates.repository.EventRepository;
import com.example.meetmates.repository.EventUserRepository;
import com.example.meetmates.repository.UserRepository;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class EventService {

    private final EventRepository eventRepository;
    private final ActivityRepository activityRepository;
    private final AddressRepository addressRepository;
    private final UserRepository userRepository;
    private final EventUserRepository eventUserRepository;
    private final EventMapper eventMapper;

    public EventService(
            EventRepository eventRepository,
            ActivityRepository activityRepository,
            AddressRepository addressRepository,
            UserRepository userRepository,
            EventUserRepository eventUserRepository,
            EventMapper eventMapper
    ) {
        this.eventRepository = eventRepository;
        this.activityRepository = activityRepository;
        this.addressRepository = addressRepository;
        this.userRepository = userRepository;
        this.eventUserRepository = eventUserRepository;
        this.eventMapper = eventMapper;
    }

    // * Crée un nouvel événement
    @Transactional
    public EventResponseDto createEvent(EventRequestDto req) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        log.info("Tentative de création d'événement par {}", auth.getName());

        User organizer = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new UnauthorizedEventAccessException("❌ Utilisateur non trouvé"));

        var activity = activityRepository.findById(req.getActivityId())
                .orElseThrow(() -> new ActivityNotFoundException("❌ Activité introuvable"));

        Address address = addressRepository.save(req.getAddress());

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

        Event saved = eventRepository.save(event);
        addOrganizer(saved, organizer);

        return eventMapper.toResponse(saved);
    }

    // * Retourne tous les événements avec leurs détails
    @Transactional(readOnly = true)
    public List<EventResponseDto> findAllResponses() {
        return eventRepository.findAllWithDetails()
                .stream()
                .map(eventMapper::toResponse)
                .toList();
    }

    // * Retourne les détails complets d'un événement par ID
    @Transactional(readOnly = true)
    public EventDetailsDto findEventDetailsById(UUID id) {

        var auth = SecurityContextHolder.getContext().getAuthentication();
        var user = userRepository.findByEmail(auth.getName()).orElse(null);

        Event event = eventRepository.findByIdWithAllRelations(id)
                .orElseThrow(() -> new EventNotFoundException("❌ Événement introuvable ou supprimé."));

        String participationStatus = null;
        if (user != null) {
            participationStatus = event.getParticipants().stream()
                    .filter(p -> p.getUser().getId().equals(user.getId()))
                    .map(p -> p.getParticipationStatus().name())
                    .findFirst()
                    .orElse("NOT_PARTICIPATING");
        }

        String organizerName = event.getParticipants().stream()
                .filter(p -> p.getRole() == EventUser.ParticipantRole.ORGANIZER)
                .findFirst()
                .map(p -> p.getUser().getFirstName() + " " + p.getUser().getLastName())
                .orElse("Inconnu");

        List<EventUserDto> accepted = event.getParticipants().stream()
                .filter(p -> p.getParticipationStatus() == EventUser.ParticipationStatus.ACCEPTED)
                .map(eventMapper::EventUserDto)
                .collect(Collectors.toList());

        List<EventUserDto> pending = event.getParticipants().stream()
                .filter(p -> p.getParticipationStatus() == EventUser.ParticipationStatus.PENDING)
                .map(eventMapper::EventUserDto)
                .collect(Collectors.toList());

        List<EventUserDto> rejected = event.getParticipants().stream()
                .filter(p -> p.getParticipationStatus() == EventUser.ParticipationStatus.REJECTED)
                .map(eventMapper::EventUserDto)
                .collect(Collectors.toList());

        return new EventDetailsDto(
                event.getId(),
                event.getTitle(),
                event.getDescription(),
                event.getEventDate().toString(),
                event.getStartTime().toString(),
                event.getEndTime().toString(),
                event.getAddress() != null ? event.getAddress().getFullAddress() : null,
                event.getActivity() != null ? event.getActivity().getName() : null,
                organizerName,
                event.getLevel().toString(),
                event.getMaterial().toString(),
                event.getStatus().toString(),
                event.getMaxParticipants(),
                participationStatus,
                accepted,
                pending,
                rejected
        );
    }

    // * Liste tous les événements liés à une activité
    @Transactional(readOnly = true)
    public List<EventResponseDto> getEventResponsesByActivity(UUID activityId) {
        return eventRepository.findByActivityIdWithDetails(activityId)
                .stream()
                .map(eventMapper::toResponse)
                .toList();
    }

    // * Supprime un événement par ID
    @Transactional
    public void delete(UUID id) {
        log.info("Demande de suppression de l'événement {}", id);

        if (!eventRepository.existsById(id)) {
            throw new EventNotFoundException("❌ Impossible de supprimer : événement introuvable.");
        }
        eventRepository.deleteById(id);
    }

    // * Met à jour un événement existant
    public EventResponseDto updateEvent(UUID id, EventRequestDto updatedEvent) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new EventNotFoundException("❌ Événement introuvable"));

        event.setTitle(updatedEvent.getTitle());
        event.setDescription(updatedEvent.getDescription());
        event.setEventDate(updatedEvent.getEventDate());
        event.setStartTime(updatedEvent.getStartTime());
        event.setEndTime(updatedEvent.getEndTime());
        event.setMaxParticipants(updatedEvent.getMaxParticipants());
        event.setStatus(updatedEvent.getStatus());
        event.setMaterial(updatedEvent.getMaterial());
        event.setLevel(updatedEvent.getLevel());

        if (updatedEvent.getAddress() != null) {
            Address existing = event.getAddress() != null ? event.getAddress() : new Address();
            Address newAddr = updatedEvent.getAddress();

            existing.setStreet(newAddr.getStreet());
            existing.setPostalCode(newAddr.getPostalCode());
            existing.setCity(newAddr.getCity());
            event.setAddress(existing);
        }

        if (updatedEvent.getActivityId() != null) {
            var activity = activityRepository.findById(updatedEvent.getActivityId())
                    .orElseThrow(() -> new ActivityNotFoundException("❌ Activité introuvable"));
            event.setActivity(activity);
        }

        Event saved = eventRepository.save(event);
        return eventMapper.toResponse(saved);
    }

    // * Recherche des événements par mot-clé
    public List<EventResponseDto> searchEvents(String query) {
        if (query == null || query.isBlank()) {
            return List.of();
        }
        return eventRepository.searchEvents(query.trim().toLowerCase())
                .stream()
                .map(eventMapper::toResponse)
                .toList();
    }

    // * Ajoute l'organisateur d'un événement dans la table EventUser
    private void addOrganizer(Event event, User organizer) {
        EventUser link = new EventUser();
        link.setEvent(event);
        link.setUser(organizer);
        link.setUserEmail(organizer.getEmail());
        link.setRole(EventUser.ParticipantRole.ORGANIZER);
        link.setParticipationStatus(EventUser.ParticipationStatus.ACCEPTED);

        eventUserRepository.save(link);

        if (event.getParticipants() == null) {
            event.setParticipants(new ArrayList<>());
        }
        event.getParticipants().add(link);
    }
}
