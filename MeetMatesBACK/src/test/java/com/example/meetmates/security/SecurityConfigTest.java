package com.example.meetmates.security;

import static org.junit.jupiter.api.Assertions.assertNotEquals;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(properties = {
        "app.frontend.url=http://localhost:3000"
})
class SecurityConfigTest {

    @Autowired
    private MockMvc mockMvc;

    // ----------------------------------------------------
    // PUBLIC URLS
    // ----------------------------------------------------

@Test
void shouldAllowPublicAuthEndpoint() throws Exception {
    mockMvc.perform(get("/auth/login"))
            .andExpect(result ->
                    assertNotEquals(401, result.getResponse().getStatus()));
}

@Test
void shouldAllowPublicEventEndpoint() throws Exception {
    mockMvc.perform(get("/event"))
            .andExpect(status().isOk());
}

    // ----------------------------------------------------
    // PROTECTED URLS
    // ----------------------------------------------------

    @Test
    void shouldRejectProtectedEndpointWithoutAuth() throws Exception {
        mockMvc.perform(get("/user/me"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void shouldRejectAdminEndpointWithoutAuth() throws Exception {
        mockMvc.perform(get("/admin/dashboard"))
                .andExpect(status().isUnauthorized());
    }
}
