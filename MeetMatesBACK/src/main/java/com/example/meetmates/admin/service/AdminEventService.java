package com.example.meetmates.admin.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.meetmates.event.dto.EventResponseDto;
import com.example.meetmates.common.exception.ApiException;
import com.example.meetmates.common.exception.ErrorCode;
import com.example.meetmates.event.mapper.EventMapper;
import com.example.meetmates.event.model.Event;
import com.example.meetmates.event.repository.EventRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class AdminEventService {

    private final EventRepository eventRepository;
    private final EventMapper eventMapper;

    /* ===================== READ ===================== */
@Transactional(readOnly = true)
public List<EventResponseDto> getAllEvents() {
    return eventRepository.findAll()
            .stream()
            .map(eventMapper::toResponse)
            .toList();
}


@Transactional(readOnly = true)
public List<EventResponseDto> getAllActiveEvents() {
    return eventRepository.findByDeletedAtIsNull()
            .stream()
            .map(eventMapper::toResponse)
            .toList();
}

    /* ===================== WRITE ===================== */
    public void softDeleteEvent(UUID eventId) {
        Event event = getEvent(eventId);

        if (event.getDeletedAt() != null) {
            return;
        }

        event.setDeletedAt(LocalDateTime.now());

        log.warn("ADMIN soft-deleted event {}", eventId);
    }

    public void restoreEvent(UUID eventId) {
        Event event = getEvent(eventId);

        event.setDeletedAt(null);

        log.info("ADMIN restored event {}", eventId);
    }

    public void hardDeleteEvent(UUID eventId) {
        Event event = getEvent(eventId);

        eventRepository.delete(event);

        log.warn("ADMIN hard-deleted event {}", eventId);
    }

    /* ===================== PRIVATE ===================== */
    private Event getEvent(UUID eventId) {
        return eventRepository.findById(eventId)
                .orElseThrow(() -> new ApiException(ErrorCode.EVENT_NOT_FOUND));
    }
}
