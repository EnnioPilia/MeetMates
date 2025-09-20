package com.example.meetmates.config;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;

@Component
public class JWTUtils {

    private final SecretKey key;
    private final int jwtExpirationMs;

    public JWTUtils(@Value("${app.jwtSecret}") String jwtSecret,
                    @Value("${app.jwtExpirationMs}") int jwtExpirationMs) {
        this.key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
        this.jwtExpirationMs = jwtExpirationMs;
    }

    public SecretKey getKey() {
        return key;
    }

    public String generateToken(String email, String role) {
        String cleanRole = role.toUpperCase();
        String prefixedRole = cleanRole.startsWith("ROLE_") ? cleanRole : "ROLE_" + cleanRole;
        return Jwts.builder()
                .setSubject(email)
                .claim("role", prefixedRole)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(key, SignatureAlgorithm.HS512)
                .compact();
    }

    public String getUsernameFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            e.printStackTrace();
        }
        return false;
    }

    public int getJwtExpirationMs() {
        return jwtExpirationMs;
    }

    /**
     * Récupère le token depuis les cookies ou le header "refreshToken" de la requête.
     */
    public String extractTokenFromRequest(HttpServletRequest request) {
        // Vérifie d'abord les cookies
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("refreshToken".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        // Sinon regarde dans le header
        return request.getHeader("refreshToken");
    }
}
