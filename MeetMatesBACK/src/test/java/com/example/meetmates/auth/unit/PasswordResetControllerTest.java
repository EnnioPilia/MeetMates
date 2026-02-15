package com.example.meetmates.auth.unit;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.example.meetmates.auth.controller.PasswordResetController;
import com.example.meetmates.auth.dto.PasswordResetConfirmDto;
import com.example.meetmates.auth.dto.PasswordResetRequestDto;
import com.example.meetmates.auth.service.PasswordResetService;
import com.example.meetmates.common.service.MessageService;

import com.fasterxml.jackson.databind.ObjectMapper;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(
        controllers = PasswordResetController.class,
        excludeAutoConfiguration = SecurityAutoConfiguration.class,
        excludeFilters = @ComponentScan.Filter(
                type = FilterType.REGEX,
                pattern = "com.example.meetmates.security.*"
        )
)
@AutoConfigureMockMvc(addFilters = false)
class PasswordResetControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private PasswordResetService passwordResetService;

    @MockBean
    private MessageService messageService;

    @Test
    void requestReset_shouldReturn200() throws Exception {

        PasswordResetRequestDto dto = new PasswordResetRequestDto();
        dto.setEmail("test@test.com");

        doNothing().when(passwordResetService)
                .createPasswordResetToken(anyString());

        when(messageService.get("PASSWORD_RESET_REQUEST_SUCCESS"))
                .thenReturn("Email de réinitialisation envoyé");

        mockMvc.perform(post("/auth/request-reset")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message")
                        .value("Email de réinitialisation envoyé"))
                .andExpect(jsonPath("$.data").doesNotExist());
    }

    @Test
    void resetPassword_shouldReturn200() throws Exception {

        PasswordResetConfirmDto dto = new PasswordResetConfirmDto();
        dto.setToken("token123");
        dto.setNewPassword("NewPassword1!");

        doNothing().when(passwordResetService)
                .resetPassword(anyString(), anyString());

        when(messageService.get("PASSWORD_RESET_CONFIRM_SUCCESS"))
                .thenReturn("Mot de passe réinitialisé");

        mockMvc.perform(post("/auth/reset-password")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message")
                        .value("Mot de passe réinitialisé"))
                .andExpect(jsonPath("$.data").doesNotExist());
    }
}
