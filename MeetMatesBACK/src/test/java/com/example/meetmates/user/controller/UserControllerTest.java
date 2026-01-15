package com.example.meetmates.user.controller;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.example.meetmates.common.service.CookieService;
import com.example.meetmates.common.service.MessageService;
import com.example.meetmates.user.dto.UpdateUserDto;
import com.example.meetmates.user.dto.UserDto;
import com.example.meetmates.user.mapper.UserMapper;
import com.example.meetmates.user.model.User;
import com.example.meetmates.user.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.persistence.EntityNotFoundException;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import org.springframework.http.MediaType;
import java.util.UUID;

import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;

import com.example.meetmates.security.JwtAuthenticationFilter;

import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(
        controllers = UserController.class,
        excludeFilters = @ComponentScan.Filter(
                type = FilterType.ASSIGNABLE_TYPE,
                classes = JwtAuthenticationFilter.class
        )
)
@AutoConfigureMockMvc(addFilters = false)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private UserService userService;

    @MockBean
    private UserMapper userMapper;

    @MockBean
    private CookieService cookieService;

    @MockBean
    private MessageService messageService;

    /* ===================== GET ME ===================== */
    @Test
    @WithMockUser(username = "user@mail.com")
    void getMe_shouldReturn200_andUserDto() throws Exception {

        UUID userId = UUID.randomUUID();

        User user = new User();

        UserDto dto = new UserDto(
                userId,
                "John",
                "Doe",
                "user@mail.com",
                25,
                "Paris",
                null,
                "USER",
                "ACTIVE",
                null
        );

        when(userService.findActiveByEmailOrThrow("user@mail.com"))
                .thenReturn(user);

        when(userMapper.toDto(user)).thenReturn(dto);
        when(messageService.get("USER_GET_ME_SUCCESS")).thenReturn("ok");

        mockMvc.perform(get("/user/me"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.id").value(userId.toString()))
                .andExpect(jsonPath("$.data.email").value("user@mail.com"));

        verify(userService).findActiveByEmailOrThrow("user@mail.com");
        verify(userMapper).toDto(user);
    }


    /* ===================== UPDATE PROFILE ===================== */
    @Test
    @WithMockUser(username = "user@mail.com")
    void updateProfile_whenInvalidDto_shouldReturn400() throws Exception {

        UpdateUserDto dto = new UpdateUserDto(); // DTO invalide

        mockMvc.perform(put("/user/me")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest());
    }

    /* ===================== EXCEPTION ===================== */
    @Test
    @WithMockUser(username = "user@mail.com")
    void getMe_whenUserNotFound_shouldReturn404() throws Exception {

        when(userService.findActiveByEmailOrThrow("user@mail.com"))
                .thenThrow(new EntityNotFoundException("User not found"));

        mockMvc.perform(get("/user/me"))
                .andExpect(status().isNotFound());

        verify(userService).findActiveByEmailOrThrow("user@mail.com");
    }
}
