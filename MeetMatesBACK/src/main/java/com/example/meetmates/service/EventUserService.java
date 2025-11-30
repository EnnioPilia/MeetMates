package com.example.meetmates.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.meetmates.dto.EventUserDto;
import com.example.meetmates.exception.ApiException;
import com.example.meetmates.exception.ErrorCode;
import com.example.meetmates.mapper.EventMapper;
import com.example.meetmates.model.Event;
import com.example.meetmates.model.EventUser;
import com.example.meetmates.model.EventUser.ParticipantRole;
import com.example.meetmates.model.EventUser.ParticipationStatus;
import com.example.meetmates.model.User;
import com.example.meetmates.repository.EventRepository;
import com.example.meetmates.repository.EventUserRepository;
import com.example.meetmates.repository.UserRepository;

@Service
public class EventUserService {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final EventUserRepository eventUserRepository;
    private final EventMapper eventMapper;

    public EventUserService(EventRepository eventRepository,
            UserRepository userRepository,
            EventUserRepository eventUserRepository,
            EventMapper eventMapper) {
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
        this.eventUserRepository = eventUserRepository;
        this.eventMapper = eventMapper;
    }

    @Transactional
    public EventUserDto joinEvent(UUID eventId, UUID userId) {

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ApiException(ErrorCode.EVENT_NOT_FOUND));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ApiException(ErrorCode.USER_NOT_FOUND));

        // Vérifie si l'utilisateur a déjà un statut dans cet événement
        EventUser existing = eventUserRepository.findByEventIdAndUserId(eventId, userId).orElse(null);

        if (existing != null) {
            switch (existing.getParticipationStatus()) {

                case ACCEPTED ->
                    throw new ApiException(ErrorCode.EVENT_ALREADY_PARTICIPANT);

                case PENDING ->
                    throw new ApiException(ErrorCode.EVENT_PENDING_ALREADY);

                case REJECTED, LEFT_REJECTED ->
                    throw new ApiException(ErrorCode.EVENT_REQUEST_REJECTED);

                case LEFT -> {
                    // L'utilisateur peut refaire une demande même sans avoir été accepté auparavant
                    existing.setParticipationStatus(ParticipationStatus.PENDING);
                    existing.setJoinedAt(LocalDateTime.now());
                    EventUser saved = eventUserRepository.save(existing);
                    return eventMapper.EventUserDto(saved); // ⬅ empêche la création d'un doublon
                }

                default ->
                    throw new ApiException(ErrorCode.EVENT_INVALID_STATUS);
            }
        }

        // Vérification du nombre max
        if (event.getMaxParticipants() != null
                && event.getParticipants().size() >= event.getMaxParticipants()) {
            throw new ApiException(ErrorCode.EVENT_FULL);
        }

        // Création d'une nouvelle demande
        EventUser eu = new EventUser();
        eu.setEvent(event);
        eu.setUser(user);
        eu.setUserEmail(user.getEmail());
        eu.setRole(ParticipantRole.PARTICIPANT);
        eu.setParticipationStatus(ParticipationStatus.PENDING);
        eu.setJoinedAt(LocalDateTime.now());

        return eventMapper.EventUserDto(eventUserRepository.save(eu));
    }

    @Transactional
    public EventUserDto leaveEvent(UUID eventId, UUID userId) {

        EventUser eu = eventUserRepository.findByEventIdAndUserId(eventId, userId)
                .orElseThrow(() -> new ApiException(ErrorCode.EVENT_FORBIDDEN));

        if (eu.getParticipationStatus() == ParticipationStatus.LEFT
                || eu.getParticipationStatus() == ParticipationStatus.LEFT_REJECTED) {

            throw new ApiException(ErrorCode.EVENT_FORBIDDEN);
        }

        if (eu.getParticipationStatus() == ParticipationStatus.REJECTED) {
            eu.setParticipationStatus(ParticipationStatus.LEFT_REJECTED);
        } else {
            eu.setParticipationStatus(ParticipationStatus.LEFT);
        }

        return eventMapper.EventUserDto(eventUserRepository.save(eu));
    }

    public EventUserDto acceptParticipant(UUID eventUserId) {
        EventUser eu = eventUserRepository.findById(eventUserId)
                .orElseThrow(() -> new ApiException(ErrorCode.PARTICIPANT_NOT_FOUND));

        eu.setParticipationStatus(ParticipationStatus.ACCEPTED);
        return eventMapper.EventUserDto(eventUserRepository.save(eu));
    }

    public EventUserDto rejectParticipant(UUID eventUserId) {
        EventUser eu = eventUserRepository.findById(eventUserId)
                .orElseThrow(() -> new ApiException(ErrorCode.PARTICIPANT_NOT_FOUND));

        eu.setParticipationStatus(ParticipationStatus.REJECTED);
        return eventMapper.EventUserDto(eventUserRepository.save(eu));
    }

    public List<EventUserDto> findByUserId(UUID userId) {
        return eventUserRepository.findAllByUserIdAndRoleAndParticipationStatusNotIn(
                userId,
                ParticipantRole.PARTICIPANT,
                List.of(ParticipationStatus.LEFT, ParticipationStatus.LEFT_REJECTED))
                .stream()
                .map(eventMapper::EventUserDto)
                .toList();
    }

    public List<EventUserDto> findOrganizedByUserId(UUID userId) {
        return eventUserRepository.findAllByUserIdAndRole(userId, ParticipantRole.ORGANIZER)
                .stream()
                .map(eventMapper::EventUserDto)
                .toList();
    }

    @Transactional
    public void removeParticipant(UUID eventId, UUID userId, UUID organizerId) {

        EventUser organizer = eventUserRepository.findByEventIdAndUserId(eventId, organizerId)
                .orElseThrow(() -> new ApiException(ErrorCode.EVENT_FORBIDDEN));

        if (organizer.getRole() != ParticipantRole.ORGANIZER) {
            throw new ApiException(ErrorCode.EVENT_FORBIDDEN);
        }

        EventUser target = eventUserRepository.findByEventIdAndUserId(eventId, userId)
                .orElseThrow(() -> new ApiException(ErrorCode.PARTICIPANT_NOT_FOUND));

        if (target.getRole() == ParticipantRole.ORGANIZER) {
            throw new ApiException(ErrorCode.EVENT_ORGANIZER_CANNOT_BE_REMOVED);
        }

        eventUserRepository.delete(target);
    }
}
