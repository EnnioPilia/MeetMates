package com.example.meetmates.event.controller;

import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
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
class EventControllerIT {

    @Autowired
    private MockMvc mockMvc;

    /* ===================== PUBLIC ===================== */

    @Test
    void findAll_shouldReturn200() throws Exception {
        mockMvc.perform(get("/event"))
                .andExpect(status().isOk());
    }

    @Test
    void search_shouldReturn200() throws Exception {
        mockMvc.perform(get("/event/search")
                .param("query", "sport"))
                .andExpect(status().isOk());
    }
    
@Test
void findById_whenEventDoesNotExist_shouldReturn404() throws Exception {
    UUID eventId = UUID.randomUUID();

    mockMvc.perform(get("/event/{id}", eventId))
            .andExpect(status().isNotFound());
}


    /* ===================== SECURITY ===================== */

@Test
@WithAnonymousUser
void create_whenNotAuthenticated_shouldReturn401() throws Exception {
    mockMvc.perform(post("/event")
            .contentType(MediaType.APPLICATION_JSON)
            .content("{}"))
            .andExpect(status().isUnauthorized());
}

@Test
@WithMockUser
void update_whenNotOrganizer_shouldReturn403() throws Exception {
    UUID eventId = UUID.randomUUID();

    mockMvc.perform(put("/event/{id}", eventId)
            .contentType(MediaType.APPLICATION_JSON)
            .content("{}"))
            .andExpect(status().isForbidden());
}


    @Test
    @WithMockUser
    void delete_whenNotOrganizer_shouldReturn403() throws Exception {
        UUID eventId = UUID.randomUUID();

        mockMvc.perform(delete("/event/{id}", eventId))
                .andExpect(status().isForbidden());
    }
}
