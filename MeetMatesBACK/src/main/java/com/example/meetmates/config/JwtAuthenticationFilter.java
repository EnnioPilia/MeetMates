package com.example.meetmates.config;

import java.io.IOException;

import org.springframework.context.annotation.Lazy;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

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
    private final UserService userService;
    private final RefreshTokenService refreshTokenService;

    public JwtAuthenticationFilter(
            JWTUtils jwtUtils,
            @Lazy UserService userService,
            RefreshTokenService refreshTokenService) {
        this.jwtUtils = jwtUtils;
        this.userService = userService;
        this.refreshTokenService = refreshTokenService;
    }

    // * Vérifie si la requête doit être ignorée par le filtre 
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getServletPath();
        return path.equals("/auth/login")
                || path.equals("/auth/register")
                || path.equals("/auth/refresh-token")
                || path.equals("/auth/verify");
    }

    // * Filtrage principal pour authentification JWT (access et refresh tokens)
    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String access = getCookie(request, "authToken");
        String refresh = getCookie(request, "refreshToken");

        // - ACCESS TOKEN -
        // * Vérifie et utilise le refresh token pour rotation et régénération d'un access token
        if (access != null) {

            if (jwtUtils.isValidAccessToken(access)) {
                String username = jwtUtils.getUsername(access);
                log.info("User authenticated with access token: {}", username);

                authenticate(username, request);
                filterChain.doFilter(request, response);
                return;
            } else {
                log.warn("Invalid access token");
            }
        }

        // - REFRESH TOKEN -
        // * Vérifie et utilise le refresh token pour rotation et régénération d'un access token
        if (refresh != null) {

            Token ref = refreshTokenService.findByToken(refresh).orElse(null);

            if (ref == null) {
                log.warn("Refresh token not found in DB");
            }
            else if (ref.isUsed()) {
                log.warn("Refresh token already used for user {}", ref.getUser().getEmail());
            }
            else if (refreshTokenService.isExpired(ref)) {
                log.warn("Refresh token expired for user {}", ref.getUser().getEmail());
            }
            else {
                Token newRefresh = refreshTokenService.rotateToken(ref);
                log.info("Refresh token rotated for user {}", ref.getUser().getEmail());

                String newAccess = jwtUtils.generateAccessToken(
                        ref.getUser().getEmail(),
                        ref.getUser().getRole().name()
                );

                sendCookie(response, "authToken", newAccess, jwtUtils.getJwtExpirationMs() / 1000);
                sendCookie(response, "refreshToken", newRefresh.getToken(), 7 * 24 * 3600);

                authenticate(ref.getUser().getEmail(), request);
                filterChain.doFilter(request, response);
                return;
            }
        }

        SecurityContextHolder.clearContext();
        filterChain.doFilter(request, response);
    }

    // * Authentifie l'utilisateur dans le contexte Spring Security
    private void authenticate(String username, HttpServletRequest request) {
        UserDetails user = userService.loadUserByUsername(username);
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
        auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(auth);
    }

    // * Envoie un cookie HTTP sécurisé avec les options appropriées
    private void sendCookie(HttpServletResponse res, String name, String value, long age) {
        ResponseCookie cookie = ResponseCookie.from(name, value)
                .httpOnly(true)
                .secure(false) // mettre true en prod
                .sameSite("Strict")
                .path("/")
                .maxAge(age)
                .build();
        res.addHeader("Set-Cookie", cookie.toString());
    }

    // * Récupère la valeur d'un cookie à partir de la requête
    private String getCookie(HttpServletRequest req, String name) {
        if (req.getCookies() == null) return null;
        for (Cookie c : req.getCookies()) {
            if (c.getName().equals(name)) return c.getValue();
        }
        return null;
    }
}
