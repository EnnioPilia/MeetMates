package com.example.meetmates.event.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
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
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import com.example.meetmates.security.EventSecurity;

import com.example.meetmates.event.dto.EventDetailsDto;
import com.example.meetmates.address.dto.AddressRequestDto;
import com.example.meetmates.common.service.MessageService;
import com.example.meetmates.event.dto.EventRequestDto;
import com.example.meetmates.event.dto.EventResponseDto;
import com.example.meetmates.event.model.Event.EventStatus;
import com.example.meetmates.event.model.Event.Level;
import com.example.meetmates.event.model.Event.MaterialOption;
import com.example.meetmates.event.service.EventService;
import com.fasterxml.jackson.databind.ObjectMapper;


//  Ce test n’est pas un IT

//  C’est un Controller Slice déguisé en IT

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
class EventControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private EventService eventService;
    
    @MockBean
    private EventSecurity eventSecurity;

    @MockBean
    private MessageService messageService;

    // === UTILS ===
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

    private AddressRequestDto buildAddress() {
        AddressRequestDto address = new AddressRequestDto();
        address.setStreet("1 Rue Test");
        address.setCity("Paris");
        address.setPostalCode("75000");
        return address;
    }

    // === TESTS ===
    @Test
    @WithMockUser(username = "user", roles = {"USER"})
    void createEvent_shouldReturn200() throws Exception {
        EventRequestDto request = new EventRequestDto();
        request.setTitle("Titre");
        request.setDescription("Desc");
        request.setEventDate(LocalDate.now());
        request.setStartTime(LocalTime.of(10, 0));
        request.setEndTime(LocalTime.of(12, 0));
        request.setMaxParticipants(10);
        request.setActivityId(UUID.randomUUID());
        request.setMaterial(MaterialOption.NOT_REQUIRED);
        request.setLevel(Level.ALL_LEVELS);
        request.setAddress(buildAddress());

        when(eventService.createEvent(any())).thenReturn(mockEventResponse());
        when(messageService.get("EVENT_CREATE_SUCCESS")).thenReturn("Event créé");

        mockMvc.perform(post("/event")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Event créé"));
    }

    @Test
    void findAllEvents_shouldReturn200() throws Exception {
        when(eventService.findAllResponses()).thenReturn(List.of(mockEventResponse()));
        when(messageService.get("EVENT_LIST_SUCCESS")).thenReturn("Liste OK");

        mockMvc.perform(get("/event"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Liste OK"));
    }

    @Test
    void findEventById_shouldReturn200() throws Exception {
        UUID id = UUID.randomUUID();
        EventDetailsDto details = new EventDetailsDto(
                id, "Titre", "Description", LocalDate.now().toString(),
                LocalTime.of(10, 0).toString(), LocalTime.of(12, 0).toString(),
                null, "Activity", "John Doe",
                "ALL_LEVELS", "NOT_REQUIRED", "OPEN",
                10, "NOT_PARTICIPATING", List.of(), List.of(), List.of()
        );

        when(eventService.findEventDetailsById(id)).thenReturn(details);
        when(messageService.get("EVENT_GET_SUCCESS")).thenReturn("Event trouvé");

        mockMvc.perform(get("/event/{id}", id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Event trouvé"));
    }

    @Test
    void searchEvents_shouldReturn200() throws Exception {
        when(eventService.searchEvents("sport")).thenReturn(List.of(mockEventResponse()));
        when(messageService.get("EVENT_SEARCH_SUCCESS")).thenReturn("Résultats trouvés");

        mockMvc.perform(get("/event/search").param("query", "sport"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Résultats trouvés"));
    }

    // === IMPORTANT ===
    // Pour updateEvent et deleteEvent, il faut un user qui passe le PreAuthorize
    @Test
    void updateEvent_shouldReturn200() throws Exception {
        UUID eventId = UUID.randomUUID();

        // Création de la requête via une méthode utilitaire
        EventRequestDto request = buildRequest();

        // Mock du bean eventSecurity pour éviter Access Denied
        when(eventSecurity.isOrganizer(any(UUID.class))).thenReturn(true);

        // Mock du service updateEvent
        when(eventService.updateEvent(any(UUID.class), any(EventRequestDto.class)))
                .thenReturn(mockEventResponse());

        // Mock du message
        when(messageService.get("EVENT_UPDATE_SUCCESS")).thenReturn("Event mis à jour");

        // Execution du test
        mockMvc.perform(put("/event/{id}", eventId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Event mis à jour"));
    }

// Méthode utilitaire pour créer un EventRequestDto
    private EventRequestDto buildRequest() {
        EventRequestDto request = new EventRequestDto();
        request.setTitle("Updated title");
        request.setDescription("Updated desc");
        request.setEventDate(LocalDate.now());
        request.setStartTime(LocalTime.of(10, 0));
        request.setEndTime(LocalTime.of(12, 0));
        request.setMaxParticipants(15);
        request.setActivityId(UUID.randomUUID());
        request.setMaterial(MaterialOption.NOT_REQUIRED);
        request.setLevel(Level.ALL_LEVELS);

        AddressRequestDto address = new AddressRequestDto();
        address.setStreet("123 Rue Test");
        address.setCity("Paris");
        address.setPostalCode("75000");
        request.setAddress(address);

        return request;
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void deleteEvent_shouldReturn200() throws Exception {
        UUID eventId = UUID.randomUUID();

        // Mock du service deleteEvent
        doNothing().when(eventService).deleteEvent(any(UUID.class));

        // Mock du message
        when(messageService.get("EVENT_DELETE_SUCCESS")).thenReturn("Event supprimé");

        // Mock de la sécurité pour que l'utilisateur soit considéré comme organisateur
        when(eventSecurity.isOrganizer(any(UUID.class))).thenReturn(true);

        // Execution du test
        mockMvc.perform(delete("/event/{id}", eventId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Event supprimé"));
    }

}
