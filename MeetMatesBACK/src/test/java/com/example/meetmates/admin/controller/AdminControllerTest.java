package com.example.meetmates.admin.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import com.example.meetmates.admin.service.AdminEventService;
import com.example.meetmates.admin.service.AdminUserService;
import com.example.meetmates.common.service.MessageService;
import com.example.meetmates.config.TestSecurityConfig;
import com.example.meetmates.event.dto.EventResponseDto;
import com.example.meetmates.user.dto.UserDto;
import com.example.meetmates.user.mapper.UserMapper;
import static org.mockito.Mockito.when;
import com.example.meetmates.security.JWTUtils;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;
import com.example.meetmates.security.JwtAuthenticationFilter;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;

import com.example.meetmates.event.dto.EventResponseDto;
import com.example.meetmates.event.model.Event.EventStatus;
import com.example.meetmates.event.model.Event.Level;
import com.example.meetmates.event.model.Event.MaterialOption;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
@AutoConfigureMockMvc
class AdminControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AdminUserService adminUserService;

    @MockBean
    private AdminEventService adminEventService;

    @MockBean
    private UserMapper userMapper;

    @MockBean
    private MessageService messageService;

    /* ===================== USERS ===================== */

    @Test
    @WithMockUser(roles = "ADMIN")
    void getAllUsers_shouldReturn200() throws Exception {
        when(adminUserService.getAllUsersIncludingDeleted()).thenReturn(List.of());
        when(messageService.get("USER_GET_ALL_SUCCESS")).thenReturn("success");

        mockMvc.perform(get("/admin/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("success"))
                .andExpect(jsonPath("$.data").isArray());
    }

@Test
@WithMockUser(roles = "ADMIN")
void softDeleteUser_shouldReturn200() throws Exception {
    UUID userId = UUID.randomUUID();

    doNothing().when(adminUserService).softDeleteUser(userId);
    when(messageService.get("ADMIN_USER_SOFT_DELETE_SUCCESS"))
            .thenReturn("deleted");

    mockMvc.perform(delete("/admin/users/{id}", userId))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.message").value("deleted"));
}


@Test
@WithMockUser(roles = "ADMIN")
void restoreUser_shouldReturn200() throws Exception {
    UUID userId = UUID.randomUUID();

    doNothing().when(adminUserService).restoreUser(userId);
    when(messageService.get("ADMIN_USER_RESTORE_SUCCESS"))
            .thenReturn("restored");

    mockMvc.perform(put("/admin/users/{id}/restore", userId))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.message").value("restored"));
}


@Test
@WithMockUser(roles = "ADMIN")
void hardDeleteUser_shouldReturn200() throws Exception {
    UUID userId = UUID.randomUUID();

    doNothing().when(adminUserService).hardDeleteUser(userId);
    when(messageService.get("ADMIN_USER_HARD_DELETE_SUCCESS"))
            .thenReturn("hard deleted");

    mockMvc.perform(delete("/admin/users/{id}/hard", userId))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.message").value("hard deleted"));
}

    /* ===================== EVENTS ===================== */

    @Test
    @WithMockUser(roles = "ADMIN")
    void getAllEvents_shouldReturn200() throws Exception {
        when(adminEventService.getAllEvents())
                .thenReturn(List.of(new EventResponseDto(
                        UUID.randomUUID(),
                        "Event title",
                        "Description",
                        LocalDate.now(),
                        LocalTime.of(10, 0),
                        LocalTime.of(12, 0),
                        10,
                        EventStatus.OPEN,
                        MaterialOption.NOT_REQUIRED,
                        Level.BEGINNER,
                        UUID.randomUUID(),
                        "Football",
                        null,
                        UUID.randomUUID(),
                        "Admin User",
                        List.of("User One", "User Two"),
                        null
                )));

        when(messageService.get("EVENT_LIST_SUCCESS"))
                .thenReturn("events");

        mockMvc.perform(get("/admin/events"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("events"))
                .andExpect(jsonPath("$.data").isArray());
    }

@Test
@WithMockUser(roles = "ADMIN")
void softDeleteEvent_shouldReturn200() throws Exception {
    UUID eventId = UUID.randomUUID();

    doNothing().when(adminEventService).softDeleteEvent(eventId);
    when(messageService.get("ADMIN_EVENT_SOFT_DELETE_SUCCESS"))
            .thenReturn("event deleted");

    mockMvc.perform(delete("/admin/events/{id}", eventId))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.message").value("event deleted"));
}

@Test
@WithMockUser(roles = "ADMIN")
void restoreEvent_shouldReturn200() throws Exception {
    UUID eventId = UUID.randomUUID();

    doNothing().when(adminEventService).restoreEvent(eventId);
    when(messageService.get("ADMIN_EVENT_RESTORE_SUCCESS"))
            .thenReturn("event restored");

    mockMvc.perform(put("/admin/events/{id}/restore", eventId))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.message").value("event restored"));
}


@Test
@WithMockUser(roles = "ADMIN")
void hardDeleteEvent_shouldReturn200() throws Exception {
    UUID eventId = UUID.randomUUID();

    doNothing().when(adminEventService).hardDeleteEvent(eventId);
    when(messageService.get("ADMIN_EVENT_HARD_DELETE_SUCCESS"))
            .thenReturn("event hard deleted");

    mockMvc.perform(delete("/admin/events/{id}/hard", eventId))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.message").value("event hard deleted"));
}


    /* ===================== SECURITY ===================== */

    @Test
    void unauthorized_whenNotAuthenticated() throws Exception {
        mockMvc.perform(get("/admin/users"))
                .andExpect(status().isUnauthorized());
    }
}
