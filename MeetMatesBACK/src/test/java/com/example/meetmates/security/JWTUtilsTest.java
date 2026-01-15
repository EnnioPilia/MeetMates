package com.example.meetmates.security;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

class JWTUtilsTest {

    private JWTUtils jwtUtils;

    private static final String SECRET
            = "my-super-secret-key-my-super-secret-key-my-super-secret-key-my-super";
    private static final int EXPIRATION = 1000 * 60;

    @BeforeEach
    void setUp() {
        jwtUtils = new JWTUtils(SECRET, EXPIRATION);
    }

    @Test
    void shouldGenerateValidAccessToken() {
        String token = jwtUtils.generateAccessToken("user@test.com", "user");

        assertNotNull(token);
        assertTrue(jwtUtils.isValidAccessToken(token));
    }

    @Test
    void shouldExtractClaimsFromToken() {
        String token = jwtUtils.generateAccessToken("user@test.com", "admin");

        Claims claims = jwtUtils.getClaims(token);

        assertEquals("user@test.com", claims.getSubject());
        assertEquals("ADMIN", claims.get("role"));
        assertEquals("ACCESS", claims.get("tokenType"));
    }

    @Test
    void shouldReturnUsernameFromToken() {
        String token = jwtUtils.generateAccessToken("user@test.com", "user");

        String username = jwtUtils.getUsername(token);

        assertEquals("user@test.com", username);
    }

    @Test
    void shouldReturnRoleFromToken() {
        String token = jwtUtils.generateAccessToken("user@test.com", "admin");

        String role = jwtUtils.getRole(token);

        assertEquals("ADMIN", role);
    }

    @Test
    void shouldRejectTokenWithWrongType() {
        String token = Jwts.builder()
                .setSubject("user@test.com")
                .claim("role", "USER")
                .claim("tokenType", "REFRESH")
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION))
                .signWith(
                        Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8)),
                        SignatureAlgorithm.HS512
                )
                .compact();

        assertFalse(jwtUtils.isValidAccessToken(token));
    }

    @Test
    void shouldRejectExpiredTokenWithoutSleep() {
        String expiredToken = Jwts.builder()
                .setSubject("user@test.com")
                .claim("role", "USER")
                .claim("tokenType", "ACCESS")
                .setIssuedAt(new Date(System.currentTimeMillis() - 10_000))
                .setExpiration(new Date(System.currentTimeMillis() - 5_000))
                .signWith(
                        Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8)),
                        SignatureAlgorithm.HS512
                )
                .compact();

        assertFalse(jwtUtils.isValidAccessToken(expiredToken));
    }

    @Test
    void shouldRejectTamperedToken() {
        String token = jwtUtils.generateAccessToken("user@test.com", "user");

        String tamperedToken = token + "invalid";

        assertFalse(jwtUtils.isValidAccessToken(tamperedToken));
    }

    @Test
    void shouldReturnNullUsernameForInvalidToken() {
        String invalidToken = "invalid.token.value";

        String username = jwtUtils.getUsername(invalidToken);

        assertNull(username);
    }

    @Test
    void shouldReturnNullRoleForInvalidToken() {
        String invalidToken = "invalid.token.value";

        String role = jwtUtils.getRole(invalidToken);

        assertNull(role);
    }

    @Test
    void shouldRejectTokenWithInvalidSignature() {
        String otherSecret
                = "other-super-secret-key-other-super-secret-key-other-super-secret";

        String tokenWithWrongSignature = Jwts.builder()
                .setSubject("user@test.com")
                .claim("role", "USER")
                .claim("tokenType", "ACCESS")
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION))
                .signWith(
                        Keys.hmacShaKeyFor(otherSecret.getBytes(StandardCharsets.UTF_8)),
                        SignatureAlgorithm.HS512
                )
                .compact();

        assertFalse(jwtUtils.isValidAccessToken(tokenWithWrongSignature));
    }

}
