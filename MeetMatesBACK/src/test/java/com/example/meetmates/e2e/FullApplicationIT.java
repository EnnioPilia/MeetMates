package com.example.meetmates.e2e;

import java.time.LocalDate;                 
import java.time.LocalTime;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.example.meetmates.activity.model.Activity;
import com.example.meetmates.activity.repository.ActivityRepository;
import com.example.meetmates.user.model.UserRole;
import com.example.meetmates.user.model.UserStatus;
import com.example.meetmates.user.repository.UserRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.http.Cookie;

@SpringBootTest
@AutoConfigureMockMvc
class FullApplicationIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ActivityRepository activityRepository;

    private void activateUser(String email, UserRole role) {
        var user = userRepository.findByEmail(email).orElseThrow();
        user.setEnabled(true);
        user.setStatus(UserStatus.ACTIVE);
        user.setRole(role);
        userRepository.save(user);
    }

    private Cookie[] login(String email) throws Exception {
        String body = """
        {
          "email": "%s",
          "password": "Password1!"
        }
        """.formatted(email);

        MvcResult result = mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(body))
                .andExpect(status().isOk())
                .andReturn();

        Cookie[] cookies = result.getResponse().getCookies();
        assert cookies.length > 0;
        return cookies;
    }

    private Activity createActivity() {
        Activity activity = new Activity();
        activity.setName("Football");
        return activityRepository.save(activity);
    }

    private void registerAndActivateUser(String email, UserRole role) throws Exception {
        String body = """
        {
          "firstName": "Test",
          "lastName": "User",
          "email": "%s",
          "password": "Password1!",
          "age": 25
        }
        """.formatted(email);

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(body))
                .andExpect(status().isCreated());

        activateUser(email, role);
    }

    @Test
    void fullScenario_shouldWork() throws Exception {

        registerAndActivateUser("orga@test.com", UserRole.USER);
        Cookie[] organizerCookies = login("orga@test.com");

        Activity activity = createActivity(); 

        String eventBody = """
            {
            "title": "Match de football",
            "description": "Match amical",
            "eventDate": "%s",
            "startTime": "%s",
            "endTime": "%s",
            "maxParticipants": 10,
            "activityId": "%s",
            "material": "NOT_REQUIRED",
            "level": "ALL_LEVELS",
            "status": "OPEN",
            "address": {
                "street": "123 Rue Exemple",
                "city": "Paris",
                "postalCode": "75001"
            }
            }
            """.formatted(
                LocalDate.now().plusDays(1),
                LocalTime.of(10, 0),
                LocalTime.of(12, 0),
                activity.getId()
        );

        MvcResult eventResult = mockMvc.perform(post("/event")
                .cookie(organizerCookies)
                .contentType(MediaType.APPLICATION_JSON)
                .content(eventBody))
                .andReturn();

        JsonNode eventJson = objectMapper.readTree(eventResult.getResponse().getContentAsString());
        String eventId = eventJson.get("data").get("id").asText();

        registerAndActivateUser("user@test.com", UserRole.USER);
        Cookie[] userCookies = login("user@test.com");

        mockMvc.perform(post("/event-user/{eventId}/join", eventId)
                .cookie(userCookies))
                .andExpect(status().isOk());
    }

    @Test
    void accessWithoutToken_shouldBeUnauthorized() throws Exception {
        mockMvc.perform(get("/user/me"))
                .andExpect(status().isUnauthorized());
    }
}
