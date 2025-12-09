package com.example.meetmates.service;

import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

import jakarta.servlet.http.HttpServletResponse;

/**
 * Service pour gérer les cookies d'authentification et de refresh token.
 * Permet de créer, supprimer et configurer les cookies sécurisés pour l'utilisateur.
 */
@Service
public class CookieService {

    private static final String AUTH_COOKIE_NAME = "authToken";
    private static final String REFRESH_COOKIE_NAME = "refreshToken";

    private static final boolean SECURE = false; // mettre true en prod
    private static final String SAME_SITE = "Strict"; // ou "None" si cross-site

    /**
     * Configure et ajoute les cookies d'authentification et de refresh dans la réponse HTTP.
     *
     * @param response          objet HttpServletResponse pour ajouter les cookies
     * @param authToken         token JWT d'accès
     * @param refreshToken      token de rafraîchissement
     * @param jwtMaxAgeSeconds  durée de vie du cookie d'accès en secondes
     * @param refreshMaxAgeSeconds durée de vie du cookie de refresh en secondes
     */
    public void setAuthCookies(HttpServletResponse response, String authToken, String refreshToken,
                               long jwtMaxAgeSeconds, long refreshMaxAgeSeconds) {
        setCookie(response, AUTH_COOKIE_NAME, authToken, jwtMaxAgeSeconds);
        setCookie(response, REFRESH_COOKIE_NAME, refreshToken, refreshMaxAgeSeconds);
    }

    /**
     * Supprime les cookies d'authentification et de refresh en les remplaçant par des valeurs vides.
     *
     * @param response objet HttpServletResponse pour supprimer les cookies
     */
    public void clearAuthCookies(HttpServletResponse response) {
        setCookie(response, AUTH_COOKIE_NAME, "", 0);
        setCookie(response, REFRESH_COOKIE_NAME, "", 0);
    }

    /**
     * Crée et ajoute un cookie HTTP dans la réponse.
     *
     * @param response objet HttpServletResponse pour ajouter le cookie
     * @param name     nom du cookie
     * @param value    valeur du cookie
     * @param maxAgeSeconds durée de vie du cookie en secondes
     */
    public void setCookie(HttpServletResponse response, String name, String value, long maxAgeSeconds) {
        ResponseCookie cookie = ResponseCookie.from(name, value)
                .httpOnly(true)
                .secure(SECURE)
                .sameSite(SAME_SITE)
                .path("/")
                .maxAge(maxAgeSeconds)
                .build();

        response.addHeader("Set-Cookie", cookie.toString());
    }

}
