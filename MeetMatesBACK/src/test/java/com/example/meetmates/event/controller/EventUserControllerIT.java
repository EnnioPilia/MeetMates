package com.example.meetmates.event.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import com.example.meetmates.common.service.MessageService;
import com.example.meetmates.event.service.EventUserService;
import com.example.meetmates.event.dto.EventUserDto;
import com.fasterxml.jackson.databind.ObjectMapper;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false) // désactive la sécurité pour tests
class UserEventControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private EventUserService eventUserService;

    @MockBean
    private MessageService messageService;

    // ================= UTIL =================
    private EventUserDto mockUserEvent() {
        return new EventUserDto(
                UUID.randomUUID(),          // id de la participation
                UUID.randomUUID(),          // eventId
                "Titre événement",          // eventTitle
                "Description de l'événement", // eventDescription
                UUID.randomUUID(),          // userId
                "John",                     // firstName
                "Doe",                      // lastName
                "john.doe@test.com",        // email
                "PARTICIPANT",              // role
                "PENDING",                  // participationStatus
                "2026-01-04T10:00",         // joinedAt
                "OPEN",                     // eventStatus
                "2026-01-10",               // eventDate
                null,                       // address (null pour le test)
                "Sport"                     // activityName
        );
    }

    // ================= TESTS =================

    @Test
    @WithMockUser(username = "user", roles = {"USER"})
    void registerUserToEvent_shouldReturn200() throws Exception {
        UUID eventId = UUID.randomUUID();

        when(eventUserService.joinEvent(any(UUID.class), any(UUID.class)))
                .thenReturn(mockUserEvent());
        when(messageService.get("USER_EVENT_REGISTER_SUCCESS")).thenReturn("Inscription réussie");

        mockMvc.perform(post("/userevent/{eventId}/register", eventId)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Inscription réussie"));
    }

    @Test
    @WithMockUser(username = "user", roles = {"USER"})
    void unregisterUserFromEvent_shouldReturn200() throws Exception {
        UUID eventId = UUID.randomUUID();

        // Utilisation correcte de doNothing() sur méthode void
        doNothing().when(eventUserService).leaveEvent(any(UUID.class), any(UUID.class));
        when(messageService.get("USER_EVENT_UNREGISTER_SUCCESS")).thenReturn("Désinscription réussie");

        mockMvc.perform(delete("/userevent/{eventId}/unregister", eventId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Désinscription réussie"));
    }

    @Test
    @WithMockUser(username = "user", roles = {"USER"})
    void listUserEvents_shouldReturn200() throws Exception {
        when(eventUserService.findByUserId(any(UUID.class))).thenReturn(List.of(mockUserEvent()));
        when(messageService.get("USER_EVENT_LIST_SUCCESS")).thenReturn("Liste OK");

        mockMvc.perform(get("/userevent"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Liste OK"));
    }
}
