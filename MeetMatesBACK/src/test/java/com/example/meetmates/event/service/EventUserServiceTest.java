package com.example.meetmates.event.service;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;

import com.example.meetmates.common.exception.ApiException;
import com.example.meetmates.common.exception.ErrorCode;
import com.example.meetmates.event.dto.EventUserDto;
import com.example.meetmates.event.mapper.EventMapper;
import com.example.meetmates.event.model.Event;
import com.example.meetmates.event.model.EventUser;
import com.example.meetmates.event.model.EventUser.ParticipantRole;
import com.example.meetmates.event.model.EventUser.ParticipationStatus;
import com.example.meetmates.event.repository.EventRepository;
import com.example.meetmates.event.repository.EventUserRepository;
import com.example.meetmates.user.model.User;
import com.example.meetmates.user.repository.UserRepository;

class EventUserServiceTest {

    @Mock private EventRepository eventRepository;
    @Mock private UserRepository userRepository;
    @Mock private EventUserRepository eventUserRepository;
    @Mock private EventMapper eventMapper;

    @InjectMocks private EventUserService eventUserService;

    private User user;
    private Event event;
    private EventUser eventUser;
    private UUID eventId;
    private UUID userId;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        user = new User();
        user.setId(UUID.randomUUID());
        user.setEmail("test@test.com");

        event = new Event();
        eventId = UUID.randomUUID();
        event.setId(eventId);
        event.setMaxParticipants(2);

        userId = user.getId();

        eventUser = new EventUser();
        eventUser.setId(UUID.randomUUID());
        eventUser.setEvent(event);
        eventUser.setUser(user);
        eventUser.setRole(ParticipantRole.PARTICIPANT);
        eventUser.setParticipationStatus(ParticipationStatus.PENDING);
    }

    @Test
    void joinEvent_success_newParticipant() {
        when(eventRepository.findById(eventId)).thenReturn(Optional.of(event));
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(eventUserRepository.findByEventIdAndUserId(eventId, userId)).thenReturn(Optional.empty());
        when(eventUserRepository.save(any(EventUser.class))).thenReturn(eventUser);
        when(eventMapper.EventUserDto(any())).thenReturn(mock(EventUserDto.class));

        EventUserDto dto = eventUserService.joinEvent(eventId, userId);

        assertNotNull(dto);
        verify(eventUserRepository, times(1)).save(any(EventUser.class));
    }

    @Test
    void joinEvent_eventNotFound() {
        when(eventRepository.findById(eventId)).thenReturn(Optional.empty());
        ApiException ex = assertThrows(ApiException.class, () -> eventUserService.joinEvent(eventId, userId));
        assertEquals(ErrorCode.EVENT_NOT_FOUND, ex.getErrorCode());
    }

    @Test
    void leaveEvent_success() {
        eventUser.setParticipationStatus(ParticipationStatus.ACCEPTED);
        when(eventUserRepository.findByEventIdAndUserId(eventId, userId)).thenReturn(Optional.of(eventUser));
        when(eventUserRepository.save(any())).thenReturn(eventUser);
        when(eventMapper.EventUserDto(any())).thenReturn(mock(EventUserDto.class));

        EventUserDto dto = eventUserService.leaveEvent(eventId, userId);

        assertNotNull(dto);
        assertEquals(ParticipationStatus.LEFT, eventUser.getParticipationStatus());
    }

    @Test
    void acceptParticipant_success() {
        when(eventUserRepository.findById(eventUser.getId())).thenReturn(Optional.of(eventUser));
        when(eventUserRepository.save(eventUser)).thenReturn(eventUser);
        when(eventMapper.EventUserDto(eventUser)).thenReturn(mock(EventUserDto.class));

        EventUserDto dto = eventUserService.acceptParticipant(eventUser.getId());

        assertNotNull(dto);
        assertEquals(ParticipationStatus.ACCEPTED, eventUser.getParticipationStatus());
    }

    @Test
    void rejectParticipant_success() {
        when(eventUserRepository.findById(eventUser.getId())).thenReturn(Optional.of(eventUser));
        when(eventUserRepository.save(eventUser)).thenReturn(eventUser);
        when(eventMapper.EventUserDto(eventUser)).thenReturn(mock(EventUserDto.class));

        EventUserDto dto = eventUserService.rejectParticipant(eventUser.getId());

        assertNotNull(dto);
        assertEquals(ParticipationStatus.REJECTED, eventUser.getParticipationStatus());
    }

    @Test
    void removeParticipant_success() {
        User organizer = new User();
        UUID organizerId = UUID.randomUUID();

        EventUser organizerEU = new EventUser();
        organizerEU.setRole(ParticipantRole.ORGANIZER);

        when(eventUserRepository.findByEventIdAndUserId(eventId, organizerId)).thenReturn(Optional.of(organizerEU));
        when(eventUserRepository.findByEventIdAndUserId(eventId, userId)).thenReturn(Optional.of(eventUser));

        eventUserService.removeParticipant(eventId, userId, organizerId);

        verify(eventUserRepository, times(1)).delete(eventUser);
    }

    @Test
    void removeParticipant_failIfNotOrganizer() {
        UUID fakeOrganizerId = UUID.randomUUID();
        EventUser notOrganizer = new EventUser();
        notOrganizer.setRole(ParticipantRole.PARTICIPANT);

        when(eventUserRepository.findByEventIdAndUserId(eventId, fakeOrganizerId)).thenReturn(Optional.of(notOrganizer));

        ApiException ex = assertThrows(ApiException.class,
                () -> eventUserService.removeParticipant(eventId, userId, fakeOrganizerId));

        assertEquals(ErrorCode.EVENT_FORBIDDEN, ex.getErrorCode());
    }
}
