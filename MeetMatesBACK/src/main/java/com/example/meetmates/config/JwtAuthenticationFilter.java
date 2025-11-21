package com.example.meetmates.config;

import java.io.IOException;

import org.springframework.context.annotation.Lazy;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.example.meetmates.exception.InvalidTokenException;
import com.example.meetmates.exception.TokenAlreadyUsedException;
import com.example.meetmates.exception.TokenNotFoundException;
import com.example.meetmates.model.Token;
import com.example.meetmates.service.RefreshTokenService;
import com.example.meetmates.service.UserService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JWTUtils jwtUtils;
    private final RefreshTokenService refreshTokenService;
    private final UserService userService;

    public JwtAuthenticationFilter(
            JWTUtils jwtUtils,
            @Lazy UserService userService,
            RefreshTokenService refreshTokenService) {
        this.jwtUtils = jwtUtils;
        this.userService = userService;
        this.refreshTokenService = refreshTokenService;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getServletPath();
        return path.equals("/auth/login")
                || path.equals("/auth/register")
                || path.equals("/auth/verify")
                || path.equals("/auth/refresh-token")
                || path.equals("/auth/reset-password")
                || path.equals("/auth/request-reset")
                || path.equals("/error");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        try {
            String access = getCookie(request, "authToken");
            String refresh = getCookie(request, "refreshToken");

            // --- ACCESS TOKEN ---
            if (access != null && jwtUtils.isValidAccessToken(access)) {
                authenticate(access, request);
            } // --- REFRESH TOKEN ---
            else if (refresh != null) {
                Token ref = refreshTokenService.findByToken(refresh).orElse(null);

                if (ref != null && !ref.isUsed() && !refreshTokenService.isExpired(ref)) {
                    Token newRefresh = refreshTokenService.rotateToken(ref);
                    String email = ref.getUser().getEmail();
                    String role = ref.getUser().getRole().name();
                    String newAccess = jwtUtils.generateAccessToken(email, role);

                    sendCookie(response, "authToken", newAccess, jwtUtils.getJwtExpirationMs() / 1000);
                    sendCookie(response, "refreshToken", newRefresh.getToken(), 7 * 24 * 3600);

                    authenticate(newAccess, request);
                }
            }

            filterChain.doFilter(request, response);

        } catch (InvalidTokenException | TokenNotFoundException | TokenAlreadyUsedException ex) {
            log.warn("Problème avec le token: {}", ex.getMessage());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("{\"message\":\"Problème avec le token.\"}");
        } catch (NullPointerException ex) {
            log.error("Erreur inattendue côté sécurité: {}", ex.getMessage(), ex);
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"message\":\"Erreur inattendue côté sécurité.\"}");
        }

    }

    // --- Authentifie l'utilisateur depuis le JWT ---
    private void authenticate(String token, HttpServletRequest request) {
        String username = jwtUtils.getUsername(token);
        String role = null;

        try {
            role = jwtUtils.getClaims(token).get("role", String.class);
        } catch (Exception e) {
            log.warn("Impossible de récupérer le rôle depuis le JWT: {}", e.getMessage());
        }

        if (username == null || role == null) {
            SecurityContextHolder.clearContext();
            log.warn("JWT invalide, contexte de sécurité non défini");
            return;
        }

        // Charger l'utilisateur depuis la DB
        var userDetails = userService.loadUserByUsername(username);

        UsernamePasswordAuthenticationToken auth
                = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );

        auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

        SecurityContextHolder.getContext().setAuthentication(auth);

        log.debug("Utilisateur authentifié {} avec rôle {}", username, role);
    }

    private void sendCookie(HttpServletResponse res, String name, String value, long age) {
        ResponseCookie cookie = ResponseCookie.from(name, value)
                .httpOnly(true)
                .secure(false) // true en prod
                .sameSite("Strict")
                .path("/")
                .maxAge(age)
                .build();
        res.addHeader("Set-Cookie", cookie.toString());
    }

    private String getCookie(HttpServletRequest req, String name) {
        if (req.getCookies() == null) {
            return null;
        }
        for (Cookie c : req.getCookies()) {
            if (c.getName().equals(name)) {
                return c.getValue();
            }
        }
        return null;
    }
}
