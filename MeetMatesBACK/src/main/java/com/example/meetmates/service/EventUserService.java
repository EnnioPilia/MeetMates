package com.example.meetmates.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.meetmates.dto.EventUserDto;
import com.example.meetmates.exception.ConflictException;
import com.example.meetmates.exception.ErrorCode;
import com.example.meetmates.exception.ForbiddenException;
import com.example.meetmates.exception.NotFoundException;
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
                .orElseThrow(() -> new NotFoundException(ErrorCode.EVENT_NOT_FOUND));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException(ErrorCode.USER_NOT_FOUND));

        eventUserRepository.findByEventIdAndUserId(eventId, userId).ifPresent(existing -> {

            switch (existing.getParticipationStatus()) {

                case ACCEPTED, PENDING ->
                        throw new ConflictException(ErrorCode.EVENT_ALREADY_PARTICIPANT);

                case REJECTED, LEFT_REJECTED ->
                        throw new ForbiddenException(ErrorCode.EVENT_FORBIDDEN);

                case LEFT -> {
                    existing.setParticipationStatus(ParticipationStatus.PENDING);
                    existing.setJoinedAt(LocalDateTime.now());
                    eventUserRepository.save(existing);
                }

                default -> throw new ConflictException(ErrorCode.EVENT_INVALID_STATUS);
            }
        });

        if (event.getMaxParticipants() != null &&
            event.getParticipants().size() >= event.getMaxParticipants()) {
            throw new ConflictException(ErrorCode.EVENT_FULL);
        }

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
                .orElseThrow(() -> new ForbiddenException(ErrorCode.EVENT_FORBIDDEN));

        if (eu.getParticipationStatus() == ParticipationStatus.LEFT ||
            eu.getParticipationStatus() == ParticipationStatus.LEFT_REJECTED) {

            throw new ConflictException(ErrorCode.EVENT_ALREADY_PARTICIPANT);
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
                .orElseThrow(() -> new NotFoundException(ErrorCode.PARTICIPANT_NOT_FOUND));

        eu.setParticipationStatus(ParticipationStatus.ACCEPTED);
        return eventMapper.EventUserDto(eventUserRepository.save(eu));
    }

    public EventUserDto rejectParticipant(UUID eventUserId) {
        EventUser eu = eventUserRepository.findById(eventUserId)
                .orElseThrow(() -> new NotFoundException(ErrorCode.PARTICIPANT_NOT_FOUND));

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
                .orElseThrow(() -> new ForbiddenException(ErrorCode.EVENT_FORBIDDEN));

        if (organizer.getRole() != ParticipantRole.ORGANIZER) {
            throw new ForbiddenException(ErrorCode.EVENT_FORBIDDEN);
        }

        EventUser target = eventUserRepository.findByEventIdAndUserId(eventId, userId)
                .orElseThrow(() -> new NotFoundException(ErrorCode.PARTICIPANT_NOT_FOUND));

        if (target.getRole() == ParticipantRole.ORGANIZER) {
            throw new ConflictException(ErrorCode.EVENT_ORGANIZER_CANNOT_BE_REMOVED);
        }

        eventUserRepository.delete(target);
    }
}
