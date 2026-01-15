package com.example.meetmates.admin.controller;

import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import jakarta.persistence.EntityNotFoundException;
import com.example.meetmates.common.exception.ApiException;
import com.example.meetmates.common.exception.ErrorCode;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;
import static org.mockito.Mockito.doThrow;
import jakarta.persistence.EntityNotFoundException;
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
import com.example.meetmates.event.model.Event.EventStatus;
import com.example.meetmates.event.model.Event.Level;
import com.example.meetmates.event.model.Event.MaterialOption;
import com.example.meetmates.user.mapper.UserMapper;
import com.example.meetmates.security.JWTUtils;
import com.example.meetmates.security.JwtAuthenticationFilter;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;

@WebMvcTest(AdminController.class)
@AutoConfigureMockMvc(addFilters = false)
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

    @MockBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @MockBean
    private JWTUtils jwtUtils;

    /* ===================== USERS ===================== */
    @Test
    @WithMockUser(roles = "ADMIN")
    void getAllUsers_shouldReturn200_andCallService() throws Exception {
        when(adminUserService.getAllUsersIncludingDeleted())
                .thenReturn(List.of());
        when(messageService.get("USER_GET_ALL_SUCCESS"))
                .thenReturn("success");

        mockMvc.perform(get("/admin/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("success"))
                .andExpect(jsonPath("$.data").isArray());

        verify(adminUserService, times(1))
                .getAllUsersIncludingDeleted();
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void softDeleteUser_shouldCallService_andReturn200() throws Exception {
        UUID userId = UUID.randomUUID();

        doNothing().when(adminUserService).softDeleteUser(userId);
        when(messageService.get("ADMIN_USER_SOFT_DELETE_SUCCESS"))
                .thenReturn("deleted");

        mockMvc.perform(delete("/admin/users/{id}", userId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("deleted"));

        verify(adminUserService, times(1))
                .softDeleteUser(userId);
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void restoreUser_shouldCallService_andReturn200() throws Exception {
        UUID userId = UUID.randomUUID();

        doNothing().when(adminUserService).restoreUser(userId);
        when(messageService.get("ADMIN_USER_RESTORE_SUCCESS"))
                .thenReturn("restored");

        mockMvc.perform(put("/admin/users/{id}/restore", userId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("restored"));

        verify(adminUserService, times(1))
                .restoreUser(userId);
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void hardDeleteUser_shouldCallService_andReturn200() throws Exception {
        UUID userId = UUID.randomUUID();

        doNothing().when(adminUserService).hardDeleteUser(userId);
        when(messageService.get("ADMIN_USER_HARD_DELETE_SUCCESS"))
                .thenReturn("hard deleted");

        mockMvc.perform(delete("/admin/users/{id}/hard", userId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("hard deleted"));

        verify(adminUserService, times(1))
                .hardDeleteUser(userId);
    }

    /* ===================== EVENTS ===================== */
    @Test
    @WithMockUser(roles = "ADMIN")
    void getAllEvents_shouldReturn200_andCallService() throws Exception {
        when(adminEventService.getAllEvents())
                .thenReturn(List.of(
                        new EventResponseDto(
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
                        )
                ));

        when(messageService.get("EVENT_LIST_SUCCESS"))
                .thenReturn("events");

        mockMvc.perform(get("/admin/events"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("events"))
                .andExpect(jsonPath("$.data").isArray());

        verify(adminEventService, times(1))
                .getAllEvents();
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void softDeleteEvent_shouldCallService_andReturn200() throws Exception {
        UUID eventId = UUID.randomUUID();

        doNothing().when(adminEventService).softDeleteEvent(eventId);
        when(messageService.get("ADMIN_EVENT_SOFT_DELETE_SUCCESS"))
                .thenReturn("event deleted");

        mockMvc.perform(delete("/admin/events/{id}", eventId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("event deleted"));

        verify(adminEventService, times(1))
                .softDeleteEvent(eventId);
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void restoreEvent_shouldCallService_andReturn200() throws Exception {
        UUID eventId = UUID.randomUUID();

        doNothing().when(adminEventService).restoreEvent(eventId);
        when(messageService.get("ADMIN_EVENT_RESTORE_SUCCESS"))
                .thenReturn("event restored");

        mockMvc.perform(put("/admin/events/{id}/restore", eventId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("event restored"));

        verify(adminEventService, times(1))
                .restoreEvent(eventId);
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void hardDeleteEvent_shouldCallService_andReturn200() throws Exception {
        UUID eventId = UUID.randomUUID();

        doNothing().when(adminEventService).hardDeleteEvent(eventId);
        when(messageService.get("ADMIN_EVENT_HARD_DELETE_SUCCESS"))
                .thenReturn("event hard deleted");

        mockMvc.perform(delete("/admin/events/{id}/hard", eventId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("event hard deleted"));

        verify(adminEventService, times(1))
                .hardDeleteEvent(eventId);
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void softDeleteUser_whenUserNotFound_shouldReturn404() throws Exception {
        UUID userId = UUID.randomUUID();

        doThrow(new ApiException(ErrorCode.USER_NOT_FOUND))
                .when(adminUserService)
                .softDeleteUser(userId);

        mockMvc.perform(delete("/admin/users/{id}", userId))
                .andExpect(status().isNotFound());
    }

}
