package com.example.meetmates.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.meetmates.config.JWTUtils;
import com.example.meetmates.dto.LoginRequestDto;
import com.example.meetmates.dto.LoginResponseDto;
import com.example.meetmates.dto.RegisterRequestDto;
import com.example.meetmates.service.AuthService;
import com.example.meetmates.service.RefreshTokenService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;


    public AuthController(
            AuthService authService,
            RefreshTokenService refreshTokenService,
            JWTUtils jwtUtils) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequestDto request) {
        String message = authService.register(request);
        return ResponseEntity.ok(Map.of("message", message));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDto request, HttpServletResponse response) {
        LoginResponseDto res = authService.login(request, response);
        return ResponseEntity.ok(res);
    }

    @GetMapping("/verify")
    public ResponseEntity<?> verifyUser(@RequestParam String token) {
        String res = authService.verifyUser(token);
        return ResponseEntity.ok(Map.of("message", res));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        authService.logout(response);
        return ResponseEntity.ok(Map.of("message", "Déconnexion réussie"));
    }

    @PostMapping("/auth/refresh-token")
    public ResponseEntity<?> refreshToken(HttpServletRequest request) {
        return ResponseEntity.ok("Token traité par le filtre");
    }

}
