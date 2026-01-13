package com.example.meetmates.admin.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.example.meetmates.common.exception.ApiException;
import com.example.meetmates.common.exception.ErrorCode;
import com.example.meetmates.event.dto.EventResponseDto;
import com.example.meetmates.event.mapper.EventMapper;
import com.example.meetmates.event.model.Event;
import com.example.meetmates.event.repository.EventRepository;

@ExtendWith(MockitoExtension.class)
class AdminEventServiceTest {

    @Mock
    private EventRepository eventRepository;

    @Mock
    private EventMapper eventMapper;

    @InjectMocks
    private AdminEventService adminEventService;

    /* ===================== GET ALL ===================== */

    @Test
    void getAllEvents_shouldReturnMappedDtos() {
        Event event = new Event();
        EventResponseDto dto = mock(EventResponseDto.class);

        when(eventRepository.findAll()).thenReturn(List.of(event));
        when(eventMapper.toResponse(event)).thenReturn(dto);

        List<EventResponseDto> result = adminEventService.getAllEvents();

        assertThat(result).hasSize(1);
        verify(eventMapper).toResponse(event);
    }

    @Test
    void getAllActiveEvents_shouldReturnOnlyNotDeleted() {
        Event event = new Event();
        EventResponseDto dto = mock(EventResponseDto.class);

        when(eventRepository.findByDeletedAtIsNull()).thenReturn(List.of(event));
        when(eventMapper.toResponse(event)).thenReturn(dto);

        List<EventResponseDto> result = adminEventService.getAllActiveEvents();

        assertThat(result).hasSize(1);
        verify(eventRepository).findByDeletedAtIsNull();
    }

    /* ===================== SOFT DELETE ===================== */

    @Test
    void softDeleteEvent_shouldSetDeletedAt() {
        UUID eventId = UUID.randomUUID();
        Event event = new Event();

        when(eventRepository.findById(eventId)).thenReturn(Optional.of(event));

        adminEventService.softDeleteEvent(eventId);

        assertThat(event.getDeletedAt()).isNotNull();
    }

    @Test
    void softDeleteEvent_shouldDoNothing_ifAlreadyDeleted() {
        UUID eventId = UUID.randomUUID();
        Event event = new Event();
        event.setDeletedAt(LocalDateTime.now());

        when(eventRepository.findById(eventId)).thenReturn(Optional.of(event));

        adminEventService.softDeleteEvent(eventId);

        verify(eventRepository, never()).delete(any());
    }

    /* ===================== RESTORE ===================== */

    @Test
    void restoreEvent_shouldClearDeletedAt() {
        UUID eventId = UUID.randomUUID();
        Event event = new Event();
        event.setDeletedAt(LocalDateTime.now());

        when(eventRepository.findById(eventId)).thenReturn(Optional.of(event));

        adminEventService.restoreEvent(eventId);

        assertThat(event.getDeletedAt()).isNull();
    }

    /* ===================== HARD DELETE ===================== */

    @Test
    void hardDeleteEvent_shouldDeleteEvent() {
        UUID eventId = UUID.randomUUID();
        Event event = new Event();

        when(eventRepository.findById(eventId)).thenReturn(Optional.of(event));

        adminEventService.hardDeleteEvent(eventId);

        verify(eventRepository).delete(event);
    }

    /* ===================== NOT FOUND ===================== */

    @Test
    void softDeleteEvent_shouldThrowException_whenEventNotFound() {
        UUID eventId = UUID.randomUUID();

        when(eventRepository.findById(eventId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> adminEventService.softDeleteEvent(eventId))
                .isInstanceOf(ApiException.class)
                .hasMessageContaining(ErrorCode.EVENT_NOT_FOUND.name());
    }
}
