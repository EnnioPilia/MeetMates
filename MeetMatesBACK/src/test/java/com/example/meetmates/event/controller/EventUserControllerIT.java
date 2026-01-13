package com.example.meetmates.event.controller;

import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithAnonymousUser;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class EventUserControllerIT {

    @Autowired
    private MockMvc mockMvc;

    /* ==========================================================
       JOIN EVENT
       ========================================================== */

    @Test
    @WithAnonymousUser
    void joinEvent_whenNotAuthenticated_shouldReturn401() throws Exception {
        mockMvc.perform(post("/event-user/{eventId}/join", UUID.randomUUID()))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser
    void joinEvent_whenEventDoesNotExist_shouldReturn404() throws Exception {
        mockMvc.perform(post("/event-user/{eventId}/join", UUID.randomUUID()))
                .andExpect(status().isNotFound());
    }

    /* ==========================================================
       LEAVE EVENT
       ========================================================== */

    @Test
    @WithAnonymousUser
    void leaveEvent_whenNotAuthenticated_shouldReturn401() throws Exception {
        mockMvc.perform(delete("/event-user/{eventId}/leave", UUID.randomUUID()))
                .andExpect(status().isUnauthorized());
    }

    /* ==========================================================
       ACCEPT / REJECT PARTICIPANT
       ========================================================== */

    @Test
    @WithAnonymousUser
    void acceptParticipant_whenNotAuthenticated_shouldReturn401() throws Exception {
        mockMvc.perform(put("/event-user/{eventUserId}/accept", UUID.randomUUID()))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser
    void acceptParticipant_whenNotOrganizer_shouldReturn403() throws Exception {
        mockMvc.perform(put("/event-user/{eventUserId}/accept", UUID.randomUUID()))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser
    void rejectParticipant_whenNotOrganizer_shouldReturn403() throws Exception {
        mockMvc.perform(put("/event-user/{eventUserId}/reject", UUID.randomUUID()))
                .andExpect(status().isForbidden());
    }

    /* ==========================================================
       GET PARTICIPATING / ORGANIZED
       ========================================================== */

    @Test
    @WithAnonymousUser
    void getEventsParticipating_whenNotAuthenticated_shouldReturn401() throws Exception {
        mockMvc.perform(get("/event-user/participating"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithAnonymousUser
    void getEventsOrganized_whenNotAuthenticated_shouldReturn401() throws Exception {
        mockMvc.perform(get("/event-user/organized"))
                .andExpect(status().isUnauthorized());
    }

    /* ==========================================================
       REMOVE PARTICIPANT
       ========================================================== */

    @Test
    @WithAnonymousUser
    void removeParticipant_whenNotAuthenticated_shouldReturn401() throws Exception {
        mockMvc.perform(delete(
                "/event-user/{eventId}/participants/{userId}",
                UUID.randomUUID(),
                UUID.randomUUID()
        ))
        .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser
    void removeParticipant_whenNotOrganizer_shouldReturn403() throws Exception {
        mockMvc.perform(delete(
                "/event-user/{eventId}/participants/{userId}",
                UUID.randomUUID(),
                UUID.randomUUID()
        ))
        .andExpect(status().isForbidden());
    }
}
