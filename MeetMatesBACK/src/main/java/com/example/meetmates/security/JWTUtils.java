package com.example.meetmates.security;

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

/**
 * Classe utilitaire responsable de la génération, la lecture et la validation
 * des tokens JWT utilisés pour l’authentification au sein de l’application.
 *
 * Elle fournit les fonctionnalités suivantes :
 * - création de tokens d’accès ;
 * - extraction des claims présentes dans un token ;
 * - récupération du rôle ou du subject (email) ;
 * - vérification de la validité d'un token d'accès.
 */
@Slf4j
@Component
public class JWTUtils {

    private final SecretKey key;
    private final int jwtExpirationMs;

    /**
     * Initialise l'utilitaire JWT avec la clé secrète et la durée d'expiration
     * définies dans la configuration de l'application.
     *
     * @param jwtSecret        clé secrète utilisée pour signer les tokens
     * @param jwtExpirationMs  durée de validité des tokens d'accès en millisecondes
     */
    public JWTUtils(@Value("${app.jwtSecret}") String jwtSecret,
                    @Value("${app.jwtExpirationMs}") int jwtExpirationMs) {
        this.key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
        this.jwtExpirationMs = jwtExpirationMs;
    }

    /**
     * Génère un token JWT d'accès contenant l'email de l'utilisateur, son rôle
     * ainsi qu'une claim "tokenType" permettant d'identifier qu'il s'agit d'un token ACCESS.
     *
     * @param email email de l'utilisateur
     * @param role  rôle attribué à l'utilisateur
     * @return un token JWT signé et valide
     */
    public String generateAccessToken(String email, String role) {

        return Jwts.builder()
                .setSubject(email)
                .claim("role", role.toUpperCase())
                .claim("tokenType", "ACCESS")
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(key, SignatureAlgorithm.HS512)
                .compact();
    }

    /**
     * Extrait toutes les claims présentes dans le token JWT.
     *
     * @param token token JWT à analyser
     * @return les claims du token
     * @throws JwtException si le token est invalide ou altéré
     */
    public Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    /**
     * Récupère le rôle de l'utilisateur stocké dans le token JWT.
     *
     * @param token token JWT d'accès
     * @return le rôle utilisateur ou null en cas d'échec
     */
    public String getRole(String token) {
        try {
            return (String) getClaims(token).get("role");
        } catch (Exception e) {
            log.error("Unable to extract role from token: {}", e.getMessage());
            return null;
        }
    }

    /**
     * Vérifie la validité d'un token d'accès.
     * Cette vérification inclut :
     * - la validité de la signature ;
     * - l’absence d'expiration ;
     * - la présence de la claim "tokenType" = "ACCESS".
     *
     * @param token token JWT à vérifier
     * @return true si le token est valide, sinon false
     */
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

    /**
     * Récupère l'email (subject) contenu dans le token JWT.
     *
     * @param token token JWT
     * @return l'email extrait ou null en cas d'erreur
     */
    public String getUsername(String token) {
        try {
            return getClaims(token).getSubject();
        } catch (JwtException e) {
            log.error("Unable to extract username from token: {}", e.getMessage());
            return null;
        }
    }

    /**
     * Retourne la durée d'expiration configurée pour les tokens d'accès.
     *
     * @return durée en millisecondes
     */
    public int getJwtExpirationMs() {
        return jwtExpirationMs;
    }
}
