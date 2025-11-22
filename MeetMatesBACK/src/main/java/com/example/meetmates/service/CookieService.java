package com.example.meetmates.service;

import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

import jakarta.servlet.http.HttpServletResponse;

@Service
public class CookieService {

    private static final String AUTH_COOKIE_NAME = "authToken";
    private static final String REFRESH_COOKIE_NAME = "refreshToken";

    private static final boolean SECURE = false; // mettre true en prod !!!!
    private static final String SAME_SITE = "Strict"; // ou "None" si cross-site


    public void setAuthCookies(HttpServletResponse response, String authToken, String refreshToken,
                               long jwtMaxAgeSeconds, long refreshMaxAgeSeconds) {
        setCookie(response, AUTH_COOKIE_NAME, authToken, jwtMaxAgeSeconds);
        setCookie(response, REFRESH_COOKIE_NAME, refreshToken, refreshMaxAgeSeconds);
    }

 
    public void clearAuthCookies(HttpServletResponse response) {
        setCookie(response, AUTH_COOKIE_NAME, "", 0);
        setCookie(response, REFRESH_COOKIE_NAME, "", 0);
    }

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
