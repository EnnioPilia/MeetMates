// package com.example.meetmates.event.controller;

// import static org.mockito.Mockito.doNothing;
// import static org.mockito.Mockito.when;
// import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
// import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
// import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
// import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
// import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

// import java.util.List;
// import java.util.UUID;

// import com.example.meetmates.event.dto.EventUserDto;
// import com.example.meetmates.event.model.EventUser.ParticipationStatus;
// import com.example.meetmates.event.model.EventUser.ParticipantRole;
// import com.example.meetmates.event.service.EventUserService;
// import com.example.meetmates.security.EventSecurity;
// import com.example.meetmates.common.service.MessageService;

// import org.junit.jupiter.api.Test;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
// import org.springframework.boot.test.mock.mockito.MockBean;
// import org.springframework.http.MediaType;
// import org.springframework.security.test.context.support.WithMockUser;
// import org.springframework.test.web.servlet.MockMvc;

// // ✅ Assure-toi que EventUserController existe bien et est importable
// import com.example.meetmates.event.controller.EventUserController;

// @WebMvcTest(controllers = EventUserController.class)
// class EventUserControllerIT {

//     @Autowired
//     private MockMvc mockMvc;

//     @MockBean
//     private EventUserService eventUserService;

//     @MockBean
//     private EventSecurity eventSecurity;

//     @MockBean
//     private MessageService messageService;

//     // ===== UTILITAIRES =====
// private EventUserDto mockDto(UUID eventId, UUID userId) {
//     return new EventUserDto(
//         UUID.randomUUID(),          // id
//         eventId,                    // eventId
//         "Titre mock",               // eventTitle
//         "Description mock",         // eventDescription
//         userId,                     // userId
//         "John",                     // firstName
//         "Doe",                      // lastName
//         "john.doe@example.com",     // email
//         ParticipantRole.PARTICIPANT.name(), // role
//         ParticipationStatus.PENDING.name(), // participationStatus
//         "2026-01-02T12:00:00",      // joinedAt
//         "OPEN",                     // eventStatus
//         "2026-01-10",               // eventDate
//         null,                       // address (ou new AddressDto(...))
//         "Activité mock"             // activityName
//     );
// }


//     private UUID randomUUID() {
//         return UUID.randomUUID();
//     }

//     // ===== TESTS =====

//     @Test
//     @WithMockUser(username = "user", roles = {"USER"})
//     void leaveEvent_shouldReturn200() throws Exception {
//         UUID eventId = randomUUID();
//         UUID userId = randomUUID();

//         when(eventUserService.leaveEvent(eventId, userId))
//                 .thenReturn(mockDto(eventId, userId));

//         mockMvc.perform(post("/event/{eventId}/leave", eventId)
//                 .param("userId", userId.toString())
//                 .contentType(MediaType.APPLICATION_JSON))
//                 .andExpect(status().isOk())
//                 .andExpect(jsonPath("$.eventId").value(eventId.toString()))
//                 .andExpect(jsonPath("$.userId").value(userId.toString()));
//     }

//     @Test
//     @WithMockUser(username = "user", roles = {"USER"})
//     void joinEvent_shouldReturn200() throws Exception {
//         UUID eventId = randomUUID();
//         UUID userId = randomUUID();

//         when(eventUserService.joinEvent(eventId, userId))
//                 .thenReturn(mockDto(eventId, userId));

//         mockMvc.perform(post("/event/{eventId}/join", eventId)
//                 .param("userId", userId.toString())
//                 .contentType(MediaType.APPLICATION_JSON))
//                 .andExpect(status().isOk())
//                 .andExpect(jsonPath("$.eventId").value(eventId.toString()))
//                 .andExpect(jsonPath("$.userId").value(userId.toString()));
//     }

//     @Test
//     @WithMockUser(username = "user", roles = {"USER"})
//     void getUserEvents_shouldReturn200() throws Exception {
//         UUID userId = randomUUID();
//         when(eventUserService.findByUserId(userId))
//                 .thenReturn(List.of(mockDto(randomUUID(), userId)));

//         mockMvc.perform(get("/event/user")
//                 .param("userId", userId.toString())
//                 .contentType(MediaType.APPLICATION_JSON))
//                 .andExpect(status().isOk())
//                 .andExpect(jsonPath("$[0].userId").value(userId.toString()));
//     }

//     @Test
//     @WithMockUser(username = "user", roles = {"USER"})
//     void getEventsOrganized_shouldReturn200() throws Exception {
//         UUID userId = randomUUID();
//         UUID eventId = randomUUID();

//         when(eventUserService.findOrganizedByUserId(userId))
//                 .thenReturn(List.of(mockDto(eventId, userId)));
//         when(eventSecurity.isOrganizer(eventId)).thenReturn(true);

//         mockMvc.perform(get("/event/organized")
//                 .param("userId", userId.toString())
//                 .contentType(MediaType.APPLICATION_JSON))
//                 .andExpect(status().isOk())
//                 .andExpect(jsonPath("$[0].userId").value(userId.toString()));
//     }

//     @Test
//     @WithMockUser(username = "admin", roles = {"ADMIN"})
//     void removeParticipant_shouldReturn200() throws Exception {
//         UUID eventId = randomUUID();
//         UUID userId = randomUUID();
//         UUID organizerId = randomUUID();

//         doNothing().when(eventUserService).removeParticipant(eventId, userId, organizerId);
//         when(eventSecurity.isOrganizer(eventId)).thenReturn(true);

//         mockMvc.perform(delete("/event/{eventId}/participant/{userId}", eventId, userId)
//                 .param("organizerId", organizerId.toString())
//                 .contentType(MediaType.APPLICATION_JSON))
//                 .andExpect(status().isOk());
//     }
// }
