package com.example.meetmates.config;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.example.meetmates.model.Token;
import com.example.meetmates.model.TokenType;
import com.example.meetmates.model.User;
import com.example.meetmates.service.RefreshTokenService;
import com.example.meetmates.service.UserService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JWTUtils jwtUtils;

    @Autowired
    @Lazy
    private UserService userService;

    @Autowired
    private RefreshTokenService refreshTokenService;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getServletPath();
        return path.startsWith("/auth/");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String authToken = null;
        String refreshTokenStr = null;

        // Extraction des cookies
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("authToken".equals(cookie.getName())) {
                    authToken = cookie.getValue();
                } else if ("refreshToken".equals(cookie.getName())) {
                    refreshTokenStr = cookie.getValue();
                }
            }
        }

        // Fallback sur le header
        if (refreshTokenStr == null) {
            refreshTokenStr = request.getHeader("refreshToken");
        }

        boolean isAuthenticated = false;

        if (authToken != null && jwtUtils.validateToken(authToken)) {
            String username = jwtUtils.getUsernameFromToken(authToken);
            authenticateUser(username, request);
            isAuthenticated = true;
        } else if (refreshTokenStr != null) {
            Token refreshToken = refreshTokenService.findByToken(refreshTokenStr)
                    .filter(t -> t.getType() == TokenType.REFRESH)
                    .orElse(null);

            if (refreshToken != null && !refreshTokenService.isRefreshTokenExpired(refreshToken)) {
                User user = refreshToken.getUser();
                String newAuthToken = jwtUtils.generateToken(user.getEmail(), user.getRole());

                // Regénération du cookie authToken
                ResponseCookie newAuthCookie = ResponseCookie.from("authToken", newAuthToken)
                        .httpOnly(true)
                        .secure(false) // mettre true en prod avec HTTPS
                        .path("/")
                        .sameSite("Strict")
                        .maxAge(jwtUtils.getJwtExpirationMs() / 1000)
                        .build();
                response.setHeader("Set-Cookie", newAuthCookie.toString());

                authenticateUser(user.getEmail(), request);
                isAuthenticated = true;
            }
        }

        if (!isAuthenticated) {
            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(request, response);
    }

    private void authenticateUser(String username, HttpServletRequest request) {
        if (SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = userService.loadUserByUsername(username);
            UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                    userDetails, null, userDetails.getAuthorities());
            authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authToken);
        }
    }
    
}
