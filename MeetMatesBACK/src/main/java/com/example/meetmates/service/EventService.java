package com.example.meetmates.service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.meetmates.dto.EventDetailsDto;
import com.example.meetmates.dto.EventRequestDto;
import com.example.meetmates.dto.EventResponseDto;
import com.example.meetmates.dto.EventUserDto;
import com.example.meetmates.exception.ApiException;
import com.example.meetmates.exception.ErrorCode;
import com.example.meetmates.mapper.EventMapper;
import com.example.meetmates.model.Address;
import com.example.meetmates.model.Event;
import com.example.meetmates.model.EventUser;
import com.example.meetmates.model.EventUser.ParticipantRole;
import com.example.meetmates.model.EventUser.ParticipationStatus;
import com.example.meetmates.model.User;
import com.example.meetmates.repository.ActivityRepository;
import com.example.meetmates.repository.AddressRepository;
import com.example.meetmates.repository.EventRepository;
import com.example.meetmates.repository.EventUserRepository;
import com.example.meetmates.repository.UserRepository;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
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
                        EventMapper eventMapper) {
        this.eventRepository = eventRepository;
        this.activityRepository = activityRepository;
        this.addressRepository = addressRepository;
        this.userRepository = userRepository;
        this.eventUserRepository = eventUserRepository;
        this.eventMapper = eventMapper;
    }

    // ----------------------------------------------------------------------
    // CREATE EVENT
    // ----------------------------------------------------------------------
    @Transactional
    public EventResponseDto createEvent(EventRequestDto req) {

        User organizer = getAuthenticatedUser();

        var activity = activityRepository.findById(req.getActivityId())
                .orElseThrow(() -> new ApiException(ErrorCode.ACTIVITY_NOT_FOUND));

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

    // ----------------------------------------------------------------------
    // FIND ALL
    // ----------------------------------------------------------------------
    @Transactional(readOnly = true)
    public List<EventResponseDto> findAllResponses() {
        return eventRepository.findAllWithDetails()
                .stream()
                .map(eventMapper::toResponse)
                .toList();
    }

    // ----------------------------------------------------------------------
    // FIND DETAILS BY ID
    // ----------------------------------------------------------------------
    @Transactional(readOnly = true)
    public EventDetailsDto findEventDetailsById(UUID eventId) {

        Event event = eventRepository.findByIdWithAllRelations(eventId)
                .orElseThrow(() -> new ApiException(ErrorCode.EVENT_NOT_FOUND));

        User user = getAuthenticatedUserOrNull();

        String participationStatus = event.getParticipants().stream()
                .filter(p -> user != null && p.getUser().getId().equals(user.getId()))
                .map(p -> p.getParticipationStatus().name())
                .findFirst()
                .orElse("NOT_PARTICIPATING");

        String organizerName = event.getParticipants().stream()
                .filter(p -> p.getRole() == ParticipantRole.ORGANIZER)
                .map(p -> p.getUser().getFirstName() + " " + p.getUser().getLastName())
                .findFirst()
                .orElse("Inconnu");

        List<EventUserDto> accepted = event.getParticipants().stream()
                .filter(p -> p.getParticipationStatus() == ParticipationStatus.ACCEPTED)
                .map(eventMapper::EventUserDto)
                .toList();

        List<EventUserDto> pending = event.getParticipants().stream()
                .filter(p -> p.getParticipationStatus() == ParticipationStatus.PENDING)
                .map(eventMapper::EventUserDto)
                .toList();

        List<EventUserDto> rejected = event.getParticipants().stream()
                .filter(p -> p.getParticipationStatus() == ParticipationStatus.REJECTED)
                .map(eventMapper::EventUserDto)
                .toList();

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
                String.valueOf(event.getLevel()),
                String.valueOf(event.getMaterial()),
                String.valueOf(event.getStatus()),
                event.getMaxParticipants(),
                participationStatus,
                accepted,
                pending,
                rejected
        );
    }

    // ----------------------------------------------------------------------
    // EVENTS BY ACTIVITY
    // ----------------------------------------------------------------------
    @Transactional(readOnly = true)
    public List<EventResponseDto> getEventResponsesByActivity(UUID activityId) {

        activityRepository.findById(activityId)
                .orElseThrow(() -> new ApiException(ErrorCode.ACTIVITY_NOT_FOUND));

        return eventRepository.findByActivityIdWithDetails(activityId)
                .stream()
                .map(eventMapper::toResponse)
                .toList();
    }

    // ----------------------------------------------------------------------
    // DELETE EVENT
    // ----------------------------------------------------------------------
    @Transactional
    public void deleteEvent(UUID eventId) {

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ApiException(ErrorCode.EVENT_NOT_FOUND));

        eventRepository.delete(event);
    }

    // --------------------------------- -------------------------------------
    // UPDATE EVENT
    // ----------------------------------------------------------------------
    @Transactional
    public EventResponseDto updateEvent(UUID eventId, EventRequestDto updatedEvent) {

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ApiException(ErrorCode.EVENT_NOT_FOUND));

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
            Address addr = event.getAddress() != null ? event.getAddress() : new Address();
            addr.setStreet(updatedEvent.getAddress().getStreet());
            addr.setPostalCode(updatedEvent.getAddress().getPostalCode());
            addr.setCity(updatedEvent.getAddress().getCity());
            event.setAddress(addr);
        }

        if (updatedEvent.getActivityId() != null) {
            var activity = activityRepository.findById(updatedEvent.getActivityId())
                    .orElseThrow(() -> new ApiException(ErrorCode.ACTIVITY_NOT_FOUND));
            event.setActivity(activity);
        }

        return eventMapper.toResponse(eventRepository.save(event));
    }

    // ----------------------------------------------------------------------
    // SEARCH
    // ----------------------------------------------------------------------
    @Transactional(readOnly = true)
    public List<EventResponseDto> searchEvents(String query) {
        if (query == null || query.isBlank()) return List.of();

        return eventRepository.searchEvents(query.trim().toLowerCase())
                .stream()
                .map(eventMapper::toResponse)
                .toList();
    }

    // ----------------------------------------------------------------------
    // INTERNAL METHODS
    // ----------------------------------------------------------------------
    private void addOrganizer(Event event, User organizer) {

        EventUser eu = new EventUser();
        eu.setEvent(event);
        eu.setUser(organizer);
        eu.setUserEmail(organizer.getEmail());
        eu.setRole(ParticipantRole.ORGANIZER);
        eu.setParticipationStatus(ParticipationStatus.ACCEPTED);

        eventUserRepository.save(eu);

        if (event.getParticipants() == null) {
            event.setParticipants(new ArrayList<>());
        }
        event.getParticipants().add(eu);
    }

    private User getAuthenticatedUser() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated())
            throw new ApiException(ErrorCode.USER_NOT_FOUND);

        return userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new ApiException(ErrorCode.USER_NOT_FOUND));
    }

    private User getAuthenticatedUserOrNull() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) return null;
        return userRepository.findByEmail(auth.getName()).orElse(null);
    }
}
