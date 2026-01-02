package com.example.meetmates.auth.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import jakarta.servlet.http.HttpServletResponse;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.example.meetmates.auth.dto.LoginRequestDto;
import com.example.meetmates.auth.dto.LoginResponseDto;
import com.example.meetmates.auth.dto.RegisterRequestDto;
import com.example.meetmates.auth.service.AuthService;
import com.example.meetmates.common.service.MessageService;
import com.fasterxml.jackson.databind.ObjectMapper;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthService authService;

    @MockBean
    private MessageService messageService;

    @Test
    void login_shouldReturn200() throws Exception {
        LoginRequestDto dto = new LoginRequestDto();
        dto.setEmail("test@test.com");
        dto.setPassword("Password1!");

        when(authService.login(any(LoginRequestDto.class), any(HttpServletResponse.class)))
                .thenReturn(new LoginResponseDto("LOGIN_OK"));

        when(messageService.get(anyString()))
                .thenReturn("Connexion réussie");

        mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Connexion réussie"));
    }

    @Test
    void register_shouldReturn201() throws Exception {
        RegisterRequestDto dto = new RegisterRequestDto();
        dto.setFirstName("John");
        dto.setLastName("Doe");
        dto.setEmail("john@mail.com");
        dto.setPassword("Password1!");
        dto.setAge(25);

        when(authService.register(any()))
                .thenReturn("AUTH_REGISTER_SUCCESS");
        when(messageService.get("AUTH_REGISTER_SUCCESS"))
                .thenReturn("Inscription réussie");

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.message").value("Inscription réussie"));
    }

    @Test
    void logout_shouldReturn200() throws Exception {
        when(authService.logout(any(HttpServletResponse.class)))
                .thenReturn("AUTH_LOGOUT_SUCCESS");
        when(messageService.get("AUTH_LOGOUT_SUCCESS"))
                .thenReturn("Déconnexion réussie");

        mockMvc.perform(post("/auth/logout"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Déconnexion réussie"));
    }

    @Test
    void verify_shouldReturn200() throws Exception {
        when(authService.verifyUser("token123"))
                .thenReturn("AUTH_VERIFY_SUCCESS");
        when(messageService.get("AUTH_VERIFY_SUCCESS"))
                .thenReturn("Compte vérifié");

        mockMvc.perform(get("/auth/verify")
                .param("token", "token123"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Compte vérifié"));
    }

}
