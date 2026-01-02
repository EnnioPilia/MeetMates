package com.example.meetmates.event.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.security.test.context.support.WithMockUser;

import com.example.meetmates.address.dto.AddressRequestDto;
import com.example.meetmates.common.service.MessageService;
import com.example.meetmates.event.dto.EventRequestDto;
import com.example.meetmates.event.dto.EventResponseDto;
import com.example.meetmates.event.model.Event.EventStatus;
import com.example.meetmates.event.model.Event.Level;
import com.example.meetmates.event.model.Event.MaterialOption;
import com.example.meetmates.event.service.EventService;
import com.fasterxml.jackson.databind.ObjectMapper;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
class EventControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private EventService eventService;

    @MockBean
    private MessageService messageService;

    /* ===== MOCK RESPONSE ===== */
    private EventResponseDto mockEventResponse() {
        return new EventResponseDto(
                UUID.randomUUID(),
                "Titre",
                "Description",
                LocalDate.now(),
                LocalTime.of(10, 0),
                LocalTime.of(12, 0),
                10,
                EventStatus.OPEN,
                MaterialOption.NOT_REQUIRED,
                Level.ALL_LEVELS,
                UUID.randomUUID(),
                "Activity",
                null,
                UUID.randomUUID(),
                "John Doe",
                List.of(),
                null
        );
    }

    /* ===== TESTS ===== */

    @Test
    @WithMockUser
    void create_shouldReturn200() throws Exception {
        AddressRequestDto address = new AddressRequestDto();
        address.setStreet("Rue de test");
        address.setCity("Paris");
        address.setPostalCode("75000");

        EventRequestDto request = new EventRequestDto();
        request.setTitle("Titre");
        request.setDescription("Description");
        request.setEventDate(LocalDate.now());
        request.setStartTime(LocalTime.of(10, 0));
        request.setEndTime(LocalTime.of(12, 0));
        request.setMaxParticipants(10);
        request.setActivityId(UUID.randomUUID());
        request.setMaterial(MaterialOption.NOT_REQUIRED);
        request.setLevel(Level.ALL_LEVELS);
        request.setAddress(address);

        EventResponseDto response = mockEventResponse();
        when(eventService.createEvent(any())).thenReturn(response);
        when(messageService.get("EVENT_CREATE_SUCCESS")).thenReturn("Event créé");

        mockMvc.perform(post("/event")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Event créé"));
    }

    @Test
    void findAll_shouldReturn200() throws Exception {
        when(eventService.findAllResponses()).thenReturn(List.of(mockEventResponse()));
        when(messageService.get(anyString())).thenReturn("EVENT_LIST_SUCCESS");

        mockMvc.perform(get("/event"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("EVENT_LIST_SUCCESS"));
    }

    @Test
    void findById_shouldReturn200() throws Exception {
        UUID id = UUID.randomUUID();

        when(eventService.findEventDetailsById(id)).thenReturn(null);
        when(messageService.get(anyString())).thenReturn("EVENT_GET_SUCCESS");

        mockMvc.perform(get("/event/{id}", id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("EVENT_GET_SUCCESS"));
    }

    @Test
    void search_shouldReturn200() throws Exception {
        when(eventService.searchEvents(anyString())).thenReturn(List.of(mockEventResponse()));
        when(messageService.get(anyString())).thenReturn("EVENT_SEARCH_SUCCESS");

        mockMvc.perform(get("/event/search")
                .param("query", "sport"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("EVENT_SEARCH_SUCCESS"));
    }
}
