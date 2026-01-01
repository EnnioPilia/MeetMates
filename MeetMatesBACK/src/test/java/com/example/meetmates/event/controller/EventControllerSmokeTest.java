package com.example.meetmates.event.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.example.meetmates.common.service.MessageService;
import com.example.meetmates.event.dto.EventResponseDto;
import com.example.meetmates.event.dto.EventRequestDto;
import com.example.meetmates.event.service.EventService;







a refaire


@WebMvcTest(EventController.class)
class EventControllerSmokeTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private EventService eventService;

    @MockBean
    private MessageService messageService;

    @Test
    void createEvent_returnsApiResponse() throws Exception {
        // mock DTO et message
        UUID eventId = UUID.randomUUID();
        EventResponseDto dto = new EventResponseDto(
                eventId, "Titre", "Desc", null, null, null, null, null,
                null, null, null, null, null, null, null, null, null
        );
        when(eventService.createEvent(any(EventRequestDto.class))).thenReturn(dto);
        when(messageService.get("EVENT_CREATE_SUCCESS")).thenReturn("Événement créé");

        // test POST /event
        mockMvc.perform(post("/event")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"Titre\",\"description\":\"Desc\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Événement créé"))
                .andExpect(jsonPath("$.data").exists());
    }
}
