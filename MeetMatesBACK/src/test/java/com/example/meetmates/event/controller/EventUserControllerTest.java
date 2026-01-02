// package com.example.meetmates.event.controller;

// import static org.mockito.ArgumentMatchers.any;
// import static org.mockito.Mockito.doNothing;
// import static org.mockito.Mockito.when;
// import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
// import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

// import java.util.List;
// import java.util.UUID;

// import org.junit.jupiter.api.BeforeEach;
// import org.junit.jupiter.api.Test;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
// import org.springframework.boot.test.context.SpringBootTest;
// import org.springframework.boot.test.mock.mockito.MockBean;
// import org.springframework.security.test.context.support.WithMockUser;
// import org.springframework.test.web.servlet.MockMvc;
// import com.example.meetmates.security.EventSecurity;

// import com.example.meetmates.address.dto.AddressDto;
// import com.example.meetmates.event.dto.EventUserDto;
// import com.example.meetmates.event.service.EventUserService;
// import com.example.meetmates.user.model.User;
// import com.example.meetmates.user.repository.UserRepository;
// import com.example.meetmates.common.service.MessageService;

// @SpringBootTest
// @AutoConfigureMockMvc(addFilters = false) // désactive Spring Security HTTP
// class EventUserControllerTest {

//     @Autowired
//     private MockMvc mockMvc;

//     @MockBean
//     private EventUserService eventUserService;

//     @MockBean
//     private UserRepository userRepository;

//     @MockBean
//     private MessageService messageService;

//     @MockBean
//     private EventSecurity eventSecurity; // MOCK pour éviter PreAuthorize AccessDenied

//     private User mockUser;
//     private EventUserDto mockEventUserDto;

//     @BeforeEach
//     void setup() {
//         mockUser = new User();
//         mockUser.setId(UUID.randomUUID());
//         mockUser.setEmail("test@example.com");

//         AddressDto address = new AddressDto(UUID.randomUUID(), "Street", "City", "75000");

//         mockEventUserDto = new EventUserDto(
//                 UUID.randomUUID(),
//                 UUID.randomUUID(),
//                 "Titre événement",
//                 "Description",
//                 mockUser.getId(),
//                 "John",
//                 "Doe",
//                 mockUser.getEmail(),
//                 "PARTICIPANT",
//                 "JOINED",
//                 "2026-01-02T10:00",
//                 "OPEN",
//                 "2026-01-10",
//                 address,
//                 "Basketball"
//         );

//         // Important : SecurityContextHolder utilisera "test@example.com"
//         when(userRepository.findByEmail("test@example.com"))
//                 .thenReturn(java.util.Optional.of(mockUser));

//         // Toujours renvoyer true pour EventSecurity pour éviter AccessDenied
//         when(eventSecurity.isOrganizer(any(UUID.class))).thenReturn(true);
//         when(eventSecurity.isOrganizerByEventUserId(any(UUID.class))).thenReturn(true);
//     }

//     @Test
//     @WithMockUser(username = "test@example.com")
//     void joinEvent_shouldReturn200() throws Exception {
//         UUID eventId = UUID.randomUUID();

//         when(eventUserService.joinEvent(eventId, mockUser.getId())).thenReturn(mockEventUserDto);
//         when(messageService.get("EVENT_JOIN_SUCCESS")).thenReturn("Participant ajouté avec succès");

//         mockMvc.perform(post("/event-user/{eventId}/join", eventId))
//                 .andExpect(status().isOk())
//                 .andExpect(jsonPath("$.message").value("Participant ajouté avec succès"))
//                 .andExpect(jsonPath("$.data.id").value(mockEventUserDto.id().toString()));
//     }

//     @Test
//     @WithMockUser(username = "test@example.com")
//     void leaveEvent_shouldReturn200() throws Exception {
//         UUID eventId = UUID.randomUUID();

//         when(eventUserService.leaveEvent(eventId, mockUser.getId())).thenReturn(mockEventUserDto);
//         when(messageService.get("EVENT_LEAVE_SUCCESS")).thenReturn("Participant retiré avec succès");

//         mockMvc.perform(delete("/event-user/{eventId}/leave", eventId))
//                 .andExpect(status().isOk())
//                 .andExpect(jsonPath("$.message").value("Participant retiré avec succès"));
//     }

//     @Test
//     void acceptParticipant_shouldReturn200() throws Exception {
//         UUID eventUserId = UUID.randomUUID();

//         when(eventUserService.acceptParticipant(eventUserId)).thenReturn(mockEventUserDto);
//         when(messageService.get("EVENT_PARTICIPANT_ACCEPT_SUCCESS")).thenReturn("Participant accepté");

//         mockMvc.perform(put("/event-user/{eventUserId}/accept", eventUserId))
//                 .andExpect(status().isOk())
//                 .andExpect(jsonPath("$.message").value("Participant accepté"));
//     }

//     @Test
//     void rejectParticipant_shouldReturn200() throws Exception {
//         UUID eventUserId = UUID.randomUUID();

//         when(eventUserService.rejectParticipant(eventUserId)).thenReturn(mockEventUserDto);
//         when(messageService.get("EVENT_PARTICIPANT_REJECT_SUCCESS")).thenReturn("Participant refusé");

//         mockMvc.perform(put("/event-user/{eventUserId}/reject", eventUserId))
//                 .andExpect(status().isOk())
//                 .andExpect(jsonPath("$.message").value("Participant refusé"));
//     }

//     @Test
//     @WithMockUser(username = "test@example.com")
//     void getEventsParticipating_shouldReturn200() throws Exception {
//         when(eventUserService.findByUserId(mockUser.getId())).thenReturn(List.of(mockEventUserDto));
//         when(messageService.get("EVENT_PARTICIPATING_LIST_SUCCESS")).thenReturn("Liste des événements participant");

//         mockMvc.perform(get("/event-user/participating"))
//                 .andExpect(status().isOk())
//                 .andExpect(jsonPath("$.message").value("Liste des événements participant"))
//                 .andExpect(jsonPath("$.data[0].id").value(mockEventUserDto.id().toString()));
//     }

//     @Test
//     @WithMockUser(username = "test@example.com")
//     void getEventsOrganized_shouldReturn200() throws Exception {
//         when(eventUserService.findOrganizedByUserId(mockUser.getId())).thenReturn(List.of(mockEventUserDto));
//         when(messageService.get("EVENT_ORGANIZED_LIST_SUCCESS")).thenReturn("Liste des événements organisés");

//         mockMvc.perform(get("/event-user/organized"))
//                 .andExpect(status().isOk())
//                 .andExpect(jsonPath("$.message").value("Liste des événements organisés"))
//                 .andExpect(jsonPath("$.data[0].id").value(mockEventUserDto.id().toString()));
//     }

//     @Test
//     @WithMockUser(username = "test@example.com")
//     void removeParticipant_shouldReturn200() throws Exception {
//         UUID eventId = UUID.randomUUID();
//         UUID userId = UUID.randomUUID();

//         doNothing().when(eventUserService).removeParticipant(eventId, userId, mockUser.getId());
//         when(messageService.get("EVENT_PARTICIPANT_REMOVE_SUCCESS")).thenReturn("Participant retiré");

//         mockMvc.perform(delete("/event-user/{eventId}/participants/{userId}", eventId, userId))
//                 .andExpect(status().isOk())
//                 .andExpect(jsonPath("$.message").value("Participant retiré"))
//                 .andExpect(jsonPath("$.data").isEmpty());
//     }
// }
