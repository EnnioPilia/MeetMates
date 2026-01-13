package com.example.meetmates.user.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithAnonymousUser;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class UserControllerIT {

    @Autowired
    private MockMvc mockMvc;

    /* ===================== SECURITY ===================== */

    @Test
    @WithAnonymousUser
    void getMe_whenNotAuthenticated_shouldReturn401() throws Exception {
        mockMvc.perform(get("/user/me"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithAnonymousUser
    void deleteMyAccount_whenNotAuthenticated_shouldReturn401() throws Exception {
        mockMvc.perform(delete("/user/me"))
                .andExpect(status().isUnauthorized());
    }

    /* ===================== AUTHENTICATED ===================== */

    @Test
    @WithMockUser(username = "user@mail.com")
    void getMe_whenAuthenticated_butUserNotFound_shouldReturn404() throws Exception {
        mockMvc.perform(get("/user/me"))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(username = "user@mail.com")
    void deleteMyAccount_whenAuthenticated_butUserNotFound_shouldReturn404() throws Exception {
        mockMvc.perform(delete("/user/me"))
                .andExpect(status().isNotFound());
    }
}
