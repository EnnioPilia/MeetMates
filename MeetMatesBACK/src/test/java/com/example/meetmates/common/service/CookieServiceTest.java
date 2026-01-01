package com.example.meetmates.common.service;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import static org.mockito.ArgumentMatchers.eq;
import org.mockito.Mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import org.mockito.junit.jupiter.MockitoExtension;

import jakarta.servlet.http.HttpServletResponse;

@ExtendWith(MockitoExtension.class)
class CookieServiceTest {

    private CookieService cookieService;

    @Mock
    private HttpServletResponse response;

    @BeforeEach
    void setUp() {
        cookieService = new CookieService();
    }

    @Test
    void should_set_auth_and_refresh_cookies() {
        // WHEN
        cookieService.setAuthCookies(
                response,
                "auth-token",
                "refresh-token",
                3600,
                7200
        );

        // THEN
        ArgumentCaptor<String> captor = ArgumentCaptor.forClass(String.class);

        verify(response, times(2))
                .addHeader(eq("Set-Cookie"), captor.capture());

        assertThat(captor.getAllValues())
                .anyMatch(c -> c.contains("authToken=auth-token"))
                .anyMatch(c -> c.contains("refreshToken=refresh-token"));
    }

    @Test
    void should_clear_auth_and_refresh_cookies() {
        // WHEN
        cookieService.clearAuthCookies(response);

        // THEN
        ArgumentCaptor<String> captor = ArgumentCaptor.forClass(String.class);

        verify(response, times(2))
                .addHeader(eq("Set-Cookie"), captor.capture());

        assertThat(captor.getAllValues())
                .anyMatch(c -> c.contains("authToken="))
                .anyMatch(c -> c.contains("refreshToken="));
    }
}
