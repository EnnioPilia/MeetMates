package com.example.meetmates.config;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class JWTUtils {

    private final SecretKey key;
    private final int jwtExpirationMs;

    public JWTUtils(@Value("${app.jwtSecret}") String jwtSecret,
                    @Value("${app.jwtExpirationMs}") int jwtExpirationMs) {
        this.key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
        this.jwtExpirationMs = jwtExpirationMs;
    }

    public String generateAccessToken(String email, String role) {
        log.debug("Generating access token for {}", email);

        return Jwts.builder()
                .setSubject(email)
                .claim("role", role.toUpperCase())
                .claim("tokenType", "ACCESS")
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(key, SignatureAlgorithm.HS512)
                .compact();
    }

    public Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public boolean isValidAccessToken(String token) {
        try {
            Claims claims = getClaims(token);

            if (!"ACCESS".equals(claims.get("tokenType"))) {
                log.warn("Rejected JWT → wrong type: {}", claims.get("tokenType"));
                return false;
            }

            return true;

        } catch (ExpiredJwtException e) {
            log.warn("JWT expired at {}", e.getClaims().getExpiration());
            return false;

        } catch (JwtException e) {
            log.warn("Invalid JWT: {}", e.getMessage());
            return false;

        } catch (IllegalArgumentException e) {
            log.warn("JWT was null or empty");
            return false;
        }
    }

    public String getUsername(String token) {
        try {
            return getClaims(token).getSubject();
        } catch (JwtException e) {
            log.error("Unable to extract username from token: {}", e.getMessage());
            return null;
        }
    }

    public int getJwtExpirationMs() {
        return jwtExpirationMs;
    }
}
