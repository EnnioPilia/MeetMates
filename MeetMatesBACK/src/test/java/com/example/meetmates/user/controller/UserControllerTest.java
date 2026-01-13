package com.example.meetmates.user.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import com.example.meetmates.common.service.CookieService;
import com.example.meetmates.common.service.MessageService;
import com.example.meetmates.user.dto.UpdateUserDto;
import com.example.meetmates.user.dto.UserDto;
import com.example.meetmates.user.mapper.UserMapper;
import com.example.meetmates.user.model.User;
import com.example.meetmates.user.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;

@SpringBootTest
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
    void getMe_shouldReturn200() throws Exception {

        when(userService.findActiveByEmailOrThrow(anyString()))
                .thenReturn(new User());

        when(userMapper.toDto(any(User.class)))
                .thenReturn(new UserDto(
                        null, "John", "Doe", "user@mail.com",
                        25, "Paris", null, "USER", "ACTIVE", null
                ));

        when(messageService.get("USER_GET_ME_SUCCESS"))
                .thenReturn("ok");

        mockMvc.perform(get("/user/me"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("ok"))
                .andExpect(jsonPath("$.data").exists());
    }

    /* ===================== UPDATE PROFILE ===================== */

    @Test
    @WithMockUser(username = "user@mail.com")
    void updateProfile_shouldReturn200() throws Exception {

        UpdateUserDto dto = new UpdateUserDto();
        dto.setFirstName("John");

        when(userService.findActiveByEmailOrThrow(anyString()))
                .thenReturn(new User());

        when(userService.updateProfile(any(User.class), any(UpdateUserDto.class)))
                .thenReturn(new User());

        when(userMapper.toDto(any(User.class)))
                .thenReturn(new UserDto(
                        null, "John", "Doe", "user@mail.com",
                        25, "Paris", null, "USER", "ACTIVE", null
                ));

        when(messageService.get("USER_PROFILE_UPDATE_SUCCESS"))
                .thenReturn("updated");

        mockMvc.perform(put("/user/me")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("updated"));
    }

    /* ===================== DELETE MY ACCOUNT ===================== */

    @Test
    @WithMockUser(username = "user@mail.com")
    void deleteMyAccount_shouldReturn200() throws Exception {

        when(userService.softDeleteByEmail("user@mail.com"))
                .thenReturn(true);

        when(messageService.get("USER_DELETE_ACCOUNT_SUCCESS"))
                .thenReturn("deleted");

        mockMvc.perform(delete("/user/me"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("deleted"));
    }
}
