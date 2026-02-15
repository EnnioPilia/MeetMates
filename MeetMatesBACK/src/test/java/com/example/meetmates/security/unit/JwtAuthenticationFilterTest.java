package com.example.meetmates.security.unit;

import java.io.IOException;
import java.util.List;

import org.junit.jupiter.api.AfterEach;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.eq;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;

import com.example.meetmates.auth.model.Token;
import com.example.meetmates.auth.service.RefreshTokenService;
import com.example.meetmates.common.service.CookieService;
import com.example.meetmates.security.JWTUtils;
import com.example.meetmates.security.JwtAuthenticationFilter;
import com.example.meetmates.user.model.UserRole;
import com.example.meetmates.user.service.UserService;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@ExtendWith(MockitoExtension.class)
class JwtAuthenticationFilterTest {

    @Mock
    private JWTUtils jwtUtils;

    @Mock
    private UserService userService;

    @Mock
    private RefreshTokenService refreshTokenService;

    @Mock
    private CookieService cookieService;

    @Mock
    private FilterChain filterChain;

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    @InjectMocks
    private JwtAuthenticationFilter filter;

    @BeforeEach
    void setup() {
        SecurityContextHolder.clearContext();
    }

    @AfterEach
    void cleanup() {
        SecurityContextHolder.clearContext();
    }

    // -------------------------------------------------------
    // SHOULD NOT FILTER
    // -------------------------------------------------------
    @Test
    void shouldIgnoreAuthLoginPath() throws ServletException, IOException {
        when(request.getServletPath()).thenReturn("/auth/login");

        filter.doFilter(request, response, filterChain);

        verify(filterChain).doFilter(request, response);
        assertNull(SecurityContextHolder.getContext().getAuthentication());
    }

    // -------------------------------------------------------
    // ACCESS TOKEN
    // -------------------------------------------------------
    @Test
    void shouldAuthenticateWithValidAccessToken()
            throws ServletException, IOException {

        when(request.getServletPath()).thenReturn("/events");

        Cookie accessCookie = new Cookie("authToken", "validAccessToken");
        when(request.getCookies()).thenReturn(new Cookie[]{accessCookie});

        when(jwtUtils.isValidAccessToken("validAccessToken")).thenReturn(true);
        when(jwtUtils.getUsername("validAccessToken")).thenReturn("user@test.com");

        Claims claims = mock(Claims.class);
        when(claims.get("role", String.class)).thenReturn("USER");
        when(jwtUtils.getClaims("validAccessToken")).thenReturn(claims);

        UserDetails userDetails = new User(
                "user@test.com",
                "password",
                List.of(() -> "ROLE_USER")
        );

        when(userService.loadUserByUsername("user@test.com"))
                .thenReturn(userDetails);

        filter.doFilter(request, response, filterChain);

        assertNotNull(SecurityContextHolder.getContext().getAuthentication());
        assertEquals(
                "user@test.com",
                SecurityContextHolder.getContext().getAuthentication().getName()
        );

        verify(filterChain).doFilter(request, response);
    }

    // -------------------------------------------------------
    // REFRESH TOKEN
    // -------------------------------------------------------
    @Test
    void shouldRotateRefreshTokenWhenAccessIsInvalid()
            throws ServletException, IOException {

        when(request.getServletPath()).thenReturn("/events");

        Cookie refreshCookie = new Cookie("refreshToken", "refresh");
        when(request.getCookies()).thenReturn(new Cookie[]{refreshCookie});

        Token refreshToken = mock(Token.class);
        Token newRefreshToken = mock(Token.class);

        com.example.meetmates.user.model.User user
                = mock(com.example.meetmates.user.model.User.class);

        when(user.getEmail()).thenReturn("user@test.com");
        when(user.getRole()).thenReturn(UserRole.USER);

        when(refreshToken.getUser()).thenReturn(user);
        when(newRefreshToken.getToken()).thenReturn("newRefresh");

        when(refreshTokenService.getValidRefreshToken("refresh"))
                .thenReturn(refreshToken);

        when(refreshTokenService.rotateRefreshToken(refreshToken))
                .thenReturn(newRefreshToken);

        when(jwtUtils.generateAccessToken("user@test.com", "USER"))
                .thenReturn("newAccess");

        when(jwtUtils.getJwtExpirationMs()).thenReturn(60000);

        when(jwtUtils.getUsername("newAccess")).thenReturn("user@test.com");

        Claims claims = mock(Claims.class);
        when(claims.get("role", String.class)).thenReturn("USER");
        when(jwtUtils.getClaims("newAccess")).thenReturn(claims);

        UserDetails userDetails = new User(
                "user@test.com",
                "pwd",
                List.of(() -> "ROLE_USER")
        );

        when(userService.loadUserByUsername("user@test.com"))
                .thenReturn(userDetails);

        filter.doFilter(request, response, filterChain);

        assertNotNull(SecurityContextHolder.getContext().getAuthentication());

        verify(cookieService).setAuthCookies(
                any(),
                eq("newAccess"),
                eq("newRefresh"),
                anyLong(),
                anyLong()
        );

        verify(filterChain).doFilter(request, response);
    }

    // -------------------------------------------------------
    // NO TOKEN
    // -------------------------------------------------------
    @Test
    void shouldNotAuthenticateWithoutTokens()
            throws ServletException, IOException {

        when(request.getServletPath()).thenReturn("/events"); // ✅ FIX

        when(request.getCookies()).thenReturn(null);

        filter.doFilter(request, response, filterChain);

        assertNull(SecurityContextHolder.getContext().getAuthentication());
        verify(filterChain).doFilter(request, response);
    }

}
