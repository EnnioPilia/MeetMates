package com.example.meetmates.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.meetmates.dto.LoginRequestDto;
import com.example.meetmates.dto.LoginResponseDto;
import com.example.meetmates.dto.MessageResponseDto;
import com.example.meetmates.dto.RegisterRequestDto;
import com.example.meetmates.dto.RegisterResponseDto;
import com.example.meetmates.service.AuthService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // * Inscription d’un nouvel utilisateur.
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequestDto request) {
         log.info("[AUTH] Tentative d'inscription pour {}", request.getEmail());

        String message = authService.register(request);

        log.info("[AUTH] Inscription réussie pour {}", request.getEmail());
        return ResponseEntity.ok(new RegisterResponseDto(message));
    }

    // * Connexion d’un utilisateur + génération des tokens.
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDto request, HttpServletResponse response) {
        log.info("[AUTH] Tentative de login pour {}", request.getEmail());

        LoginResponseDto res = authService.login(request, response);

        log.info("[AUTH] Login réussi pour {}", request.getEmail());
        return ResponseEntity.ok(res);
    }

    // * Vérification du compte via un token envoyé par email.
    @GetMapping("/verify")
    public ResponseEntity<?> verifyUser(@RequestParam String token) {
        log.info("[AUTH] Vérification du compte via token");

        String res = authService.verifyUser(token);

        log.info("[AUTH] Vérification effectuée");
        return ResponseEntity.ok(Map.of("message", res));
    }

    // * Déconnexion : suppression du cookie JWT.
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        log.info("[AUTH] Déconnexion de l'utilisateur");

        authService.logout(response);

        log.info("[AUTH] Déconnexion réussie");
        return ResponseEntity.ok(new MessageResponseDto("Déconnexion réussie"));
    }

    // * Retour du refresh token (déjà géré par un filtre).
    @PostMapping("/auth/refresh-token")
    public ResponseEntity<?> refreshToken(HttpServletRequest request) {

        log.info("[AUTH] Refresh token : requête interceptée et gérée par le filtre");
        return ResponseEntity.ok("Token traité par le filtre");
    }
}
