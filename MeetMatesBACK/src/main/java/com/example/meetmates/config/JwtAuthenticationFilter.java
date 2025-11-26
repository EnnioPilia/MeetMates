package com.example.meetmates.config;

import java.io.IOException;

import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.example.meetmates.exception.ConflictException;
import com.example.meetmates.exception.NotFoundException;
import com.example.meetmates.model.Token;
import com.example.meetmates.service.CookieService;
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
    private final CookieService cookieService;

    public JwtAuthenticationFilter(
            JWTUtils jwtUtils,
            @Lazy UserService userService,
            RefreshTokenService refreshTokenService,
            CookieService cookieService) {
        this.jwtUtils = jwtUtils;
        this.userService = userService;
        this.refreshTokenService = refreshTokenService;
        this.cookieService = cookieService;
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
            } 
            // --- REFRESH TOKEN ---
            else if (refresh != null) {
                try {
                    Token ref = refreshTokenService.getValidRefreshToken(refresh);
                    Token newRefresh = refreshTokenService.rotateRefreshToken(ref);

                    String email = ref.getUser().getEmail();
                    String role = ref.getUser().getRole().name();
                    String newAccess = jwtUtils.generateAccessToken(email, role);

                    cookieService.setAuthCookies(
                            response,
                            newAccess,
                            newRefresh.getToken(),
                            jwtUtils.getJwtExpirationMs() / 1000,
                            7 * 24 * 3600
                    );

                    authenticate(newAccess, request);

                } catch (ConflictException | NotFoundException ex) {
                    log.warn("Problème avec le refresh token: {}", ex.getMessage());
                    cookieService.clearAuthCookies(response);
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.getWriter().write("{\"message\":\"" + ex.getMessage() + "\"}");
                    return;
                }
            }

            filterChain.doFilter(request, response);

        } catch (Exception ex) {
            log.error("Erreur inattendue côté sécurité: {}", ex.getMessage(), ex);
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"message\":\"Erreur inattendue côté sécurité.\"}");
        }
    }

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

    private String getCookie(HttpServletRequest req, String name) {
        if (req.getCookies() == null) return null;
        for (Cookie c : req.getCookies()) {
            if (c.getName().equals(name)) return c.getValue();
        }
        return null;
    }
}
