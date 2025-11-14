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
import com.example.meetmates.model.Address;
import com.example.meetmates.model.Event;
import com.example.meetmates.model.EventUser;
import com.example.meetmates.model.User;
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
    private final EventMapper eventMapper;

    public EventService(EventRepository eventRepository,
            ActivityRepository activityRepository,
            AddressRepository addressRepository,
            UserRepository userRepository,
            EventUserRepository eventUserRepository,
            EventMapper eventMapper,
            PictureService pictureService) {
        this.eventRepository = eventRepository;
        this.activityRepository = activityRepository;
        this.addressRepository = addressRepository;
        this.userRepository = userRepository;
        this.eventUserRepository = eventUserRepository;
        this.eventMapper = eventMapper;
      }

    @Transactional
    public EventResponseDto createEvent(EventRequestDto req) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User organizer = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        var activity = activityRepository.findById(req.getActivityId())
                .orElseThrow(() -> new RuntimeException("Activité introuvable"));

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

    @Transactional(readOnly = true)
    public List<EventResponseDto> findAllResponses() {
        return eventRepository.findAllWithPictures()
                .stream()
                .map(eventMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public EventDetailsDto findEventDetailsById(UUID id) {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        var user = userRepository.findByEmail(auth.getName()).orElse(null);

        Event event = eventRepository.findByIdWithAllRelations(id)
                .orElseThrow(() -> new RuntimeException("Événement introuvable avec l'id: " + id));

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

    @Transactional(readOnly = true)
    public List<EventResponseDto> getEventResponsesByActivity(UUID activityId) {
        return eventRepository.findByActivityIdWithPictures(activityId)
                .stream()
                .map(eventMapper::toResponse)
                .toList();
    }

    @Transactional
    public void delete(UUID id) {
        eventRepository.deleteById(id);
    }

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

    public EventResponseDto updateEvent(UUID id, EventRequestDto updatedEvent) {
        return eventRepository.findById(id)
                .map(event -> {
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
                        Address newAddress = updatedEvent.getAddress();
                        Address existingAddress = event.getAddress();

                        if (existingAddress == null) {
                            existingAddress = new Address();
                        }

                        existingAddress.setStreet(newAddress.getStreet());
                        existingAddress.setPostalCode(newAddress.getPostalCode());
                        existingAddress.setCity(newAddress.getCity());

                        event.setAddress(existingAddress);
                    }

                    if (updatedEvent.getActivityId() != null) {
                        event.setActivity(activityRepository.findById(updatedEvent.getActivityId())
                                .orElseThrow(() -> new RuntimeException("Activity not found")));
                    }

                    Event saved = eventRepository.save(event);
                    return eventMapper.toResponse(saved);
                })
                .orElseThrow(() -> new RuntimeException("Event not found"));
    }

    public List<EventResponseDto> searchEvents(String query) {
        if (query == null || query.isBlank()) {
            return List.of();
        }
        return eventRepository.searchEvents(query.trim().toLowerCase())
                .stream()
                .map(eventMapper::toResponse)
                .toList();
    }

}
