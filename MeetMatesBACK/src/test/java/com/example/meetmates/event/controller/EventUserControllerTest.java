package com.example.meetmates.event.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import com.example.meetmates.common.service.MessageService;
import com.example.meetmates.config.TestSecurityConfig;
import com.example.meetmates.event.dto.EventUserDto;
import com.example.meetmates.event.service.EventUserService;
import com.example.meetmates.security.EventSecurity;
import com.example.meetmates.user.model.User;
import com.example.meetmates.user.repository.UserRepository;

@WebMvcTest(
    controllers = EventUserController.class,
    excludeFilters = {
        @ComponentScan.Filter(
            type = FilterType.ASSIGNABLE_TYPE,
            classes = com.example.meetmates.security.JwtAuthenticationFilter.class
        )
    }
)
@AutoConfigureMockMvc
@Import(TestSecurityConfig.class)
class EventUserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private EventUserService eventUserService;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private MessageService messageService;

    @MockBean(name = "eventSecurity")
    private EventSecurity eventSecurity;

    /* ===== UTILS ===== */

    private User mockUser() {
        User user = new User();
        user.setId(UUID.randomUUID());
        user.setEmail("user@test.com");
        return user;
    }

    private EventUserDto mockEventUserDto() {
        return new EventUserDto(
                UUID.randomUUID(),
                UUID.randomUUID(),
                "Event title",
                "Event description",
                UUID.randomUUID(),
                "John",
                "Doe",
                "john.doe@test.com",
                "PARTICIPANT",
                "PENDING",
                "2024-01-01T10:00:00",
                "OPEN",
                "2024-02-01",
                null,
                "Football"
        );
    }

    /* ===== TESTS ===== */

    @Test
    @WithMockUser(username = "user@test.com")
    void joinEvent_shouldReturn200() throws Exception {
        UUID eventId = UUID.randomUUID();
        User user = mockUser();

        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(user));
        when(eventUserService.joinEvent(eventId, user.getId()))
                .thenReturn(mockEventUserDto());
        when(messageService.get("EVENT_JOIN_SUCCESS"))
                .thenReturn("Event rejoint");

        mockMvc.perform(post("/event-user/{eventId}/join", eventId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Event rejoint"));
    }

    @Test
    @WithMockUser(username = "user@test.com")
    void leaveEvent_shouldReturn200() throws Exception {
        UUID eventId = UUID.randomUUID();
        User user = mockUser();

        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(user));
        when(eventUserService.leaveEvent(eventId, user.getId()))
                .thenReturn(mockEventUserDto());
        when(messageService.get("EVENT_LEAVE_SUCCESS"))
                .thenReturn("Event quitté");

        mockMvc.perform(delete("/event-user/{eventId}/leave", eventId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Event quitté"));
    }

    @Test
    void acceptParticipant_shouldReturn200() throws Exception {
        UUID eventUserId = UUID.randomUUID();

        when(eventSecurity.isOrganizerByEventUserId(eventUserId)).thenReturn(true);
        when(eventUserService.acceptParticipant(eventUserId))
                .thenReturn(mockEventUserDto());
        when(messageService.get("EVENT_PARTICIPANT_ACCEPT_SUCCESS"))
                .thenReturn("Participant accepté");

        mockMvc.perform(put("/event-user/{id}/accept", eventUserId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Participant accepté"));
    }

    @Test
    void rejectParticipant_shouldReturn200() throws Exception {
        UUID eventUserId = UUID.randomUUID();

        when(eventSecurity.isOrganizerByEventUserId(eventUserId)).thenReturn(true);
        when(eventUserService.rejectParticipant(eventUserId))
                .thenReturn(mockEventUserDto());
        when(messageService.get("EVENT_PARTICIPANT_REJECT_SUCCESS"))
                .thenReturn("Participant refusé");

        mockMvc.perform(put("/event-user/{id}/reject", eventUserId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Participant refusé"));
    }

    @Test
    @WithMockUser(username = "user@test.com")
    void getEventsParticipating_shouldReturn200() throws Exception {
        User user = mockUser();

        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(user));
        when(eventUserService.findByUserId(user.getId()))
                .thenReturn(List.of(mockEventUserDto()));
        when(messageService.get("EVENT_PARTICIPATING_LIST_SUCCESS"))
                .thenReturn("Liste participation");

        mockMvc.perform(get("/event-user/participating"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Liste participation"));
    }

    @Test
    @WithMockUser(username = "user@test.com")
    void getEventsOrganized_shouldReturn200() throws Exception {
        User user = mockUser();

        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(user));
        when(eventUserService.findOrganizedByUserId(user.getId()))
                .thenReturn(List.of(mockEventUserDto()));
        when(messageService.get("EVENT_ORGANIZED_LIST_SUCCESS"))
                .thenReturn("Liste organisée");

        mockMvc.perform(get("/event-user/organized"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Liste organisée"));
    }

    @Test
    @WithMockUser(username = "organizer@test.com")
    void removeParticipant_shouldReturn200() throws Exception {
        UUID eventId = UUID.randomUUID();
        UUID userId = UUID.randomUUID();
        User organizer = mockUser();

        when(userRepository.findByEmail(anyString()))
                .thenReturn(Optional.of(organizer));
        when(eventSecurity.isOrganizer(eventId))
                .thenReturn(true);

        doNothing().when(eventUserService)
                .removeParticipant(eventId, userId, organizer.getId());

        when(messageService.get("EVENT_PARTICIPANT_REMOVE_SUCCESS"))
                .thenReturn("Participant retiré");

        mockMvc.perform(delete("/event-user/{eventId}/participants/{userId}", eventId, userId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Participant retiré"));
    }
}
