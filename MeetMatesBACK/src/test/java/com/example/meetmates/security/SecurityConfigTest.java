package com.example.meetmates.security;

import static org.junit.jupiter.api.Assertions.assertNotEquals;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
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

    @Test
    void shouldAllowPublicAuthEndpoint() throws Exception {
        mockMvc.perform(get("/auth/login"))
                .andExpect(result
                        -> assertNotEquals(401, result.getResponse().getStatus()));
    }

    @Test
    void shouldAllowPublicEventEndpoint() throws Exception {
        mockMvc.perform(get("/event"))
                .andExpect(status().isOk());
    }

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

    @Test
    @WithMockUser(username = "user@test.com", roles = "USER")
    void shouldRejectUserAccessToAdminEndpoint() throws Exception {
        mockMvc.perform(get("/admin/dashboard"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "user@test.com", roles = "USER")
    void shouldAllowAuthenticatedUserAccessToUserMe() throws Exception {
        mockMvc.perform(get("/user/me"))
                .andExpect(result
                        -> assertNotEquals(401, result.getResponse().getStatus()))
                .andExpect(result
                        -> assertNotEquals(403, result.getResponse().getStatus()));
    }

    @Test
    @WithMockUser(username = "admin@test.com", roles = "ADMIN")
    void shouldAllowAdminAccessToAdminEndpoint() throws Exception {
        mockMvc.perform(get("/admin/dashboard"))
                .andExpect(result
                        -> assertNotEquals(401, result.getResponse().getStatus()))
                .andExpect(result
                        -> assertNotEquals(403, result.getResponse().getStatus()));
    }

}
