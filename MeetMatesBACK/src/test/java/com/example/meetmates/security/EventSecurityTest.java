package com.example.meetmates.security;

import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.AfterEach;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import com.example.meetmates.event.model.Event;
import com.example.meetmates.event.model.EventUser;
import com.example.meetmates.event.model.EventUser.ParticipantRole;
import com.example.meetmates.event.repository.EventUserRepository;
import com.example.meetmates.user.model.User;
import com.example.meetmates.user.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class EventSecurityTest {

    @Mock
    EventUserRepository eventUserRepository;

    @Mock
    UserRepository userRepository;

    @InjectMocks
    EventSecurity eventSecurity;

    User user;
    UUID eventId;

    @BeforeEach
    void setupSecurityContext() {
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken("test@mail.com", null)
        );

        user = new User();
        user.setId(UUID.randomUUID());
        user.setEmail("test@mail.com");

        eventId = UUID.randomUUID();
    }

    @AfterEach
    void clearContext() {
        SecurityContextHolder.clearContext();
    }

    // ================= isOrganizer =================
    @Test
    void shouldReturnTrueWhenUserIsOrganizer() {
        EventUser eu = new EventUser();
        eu.setRole(ParticipantRole.ORGANIZER);

        when(userRepository.findByEmail("test@mail.com"))
                .thenReturn(Optional.of(user));
        when(eventUserRepository.findByEventIdAndUserId(eventId, user.getId()))
                .thenReturn(Optional.of(eu));

        assertTrue(eventSecurity.isOrganizer(eventId));
    }

    @Test
    void shouldReturnFalseWhenUserNotFound() {
        when(userRepository.findByEmail("test@mail.com"))
                .thenReturn(Optional.empty());

        assertFalse(eventSecurity.isOrganizer(eventId));
    }

    @Test
    void shouldReturnFalseWhenNotOrganizer() {
        EventUser eu = new EventUser();
        eu.setRole(ParticipantRole.PARTICIPANT);

        when(userRepository.findByEmail("test@mail.com"))
                .thenReturn(Optional.of(user));
        when(eventUserRepository.findByEventIdAndUserId(eventId, user.getId()))
                .thenReturn(Optional.of(eu));

        assertFalse(eventSecurity.isOrganizer(eventId));
    }

    // ================= isOrganizerByEventUserId =================
    @Test
    void shouldReturnTrueForOrganizerByEventUserId() {
        UUID eventUserId = UUID.randomUUID();

        Event event = new Event();
        event.setId(eventId);

        EventUser eu = new EventUser();
        eu.setEvent(event);

        EventUser organizerLink = new EventUser();
        organizerLink.setRole(ParticipantRole.ORGANIZER);

        when(userRepository.findByEmail("test@mail.com"))
                .thenReturn(Optional.of(user));
        when(eventUserRepository.findById(eventUserId))
                .thenReturn(Optional.of(eu));
        when(eventUserRepository.findByEventIdAndUserId(eventId, user.getId()))
                .thenReturn(Optional.of(organizerLink));

        assertTrue(eventSecurity.isOrganizerByEventUserId(eventUserId));
    }

    @Test
    void shouldReturnFalseWhenEventUserNotFound() {
        when(userRepository.findByEmail("test@mail.com"))
                .thenReturn(Optional.of(user));
        when(eventUserRepository.findById(any()))
                .thenReturn(Optional.empty());

        assertFalse(eventSecurity.isOrganizerByEventUserId(UUID.randomUUID()));
    }

    @Test
    void shouldReturnFalseWhenNoEventUserLink() {
        when(userRepository.findByEmail("test@mail.com"))
                .thenReturn(Optional.of(user));
        when(eventUserRepository.findByEventIdAndUserId(any(), any()))
                .thenReturn(Optional.empty());

        assertFalse(eventSecurity.isOrganizer(eventId));
    }

    @Test
    void shouldReturnFalseWhenAuthenticationNameIsNull() {
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(null, null)
        );

        assertFalse(eventSecurity.isOrganizer(UUID.randomUUID()));
    }

    @Test
    void shouldNotQueryEventUserWhenUserNotFound() {
        when(userRepository.findByEmail("test@mail.com"))
                .thenReturn(Optional.empty());

        eventSecurity.isOrganizer(eventId);

        verify(eventUserRepository, never())
                .findByEventIdAndUserId(any(), any());
    }

}
