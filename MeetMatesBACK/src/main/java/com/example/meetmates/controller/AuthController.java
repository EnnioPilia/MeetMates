package com.example.meetmates.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.meetmates.dto.ApiResponse;
import com.example.meetmates.dto.LoginRequestDto;
import com.example.meetmates.dto.LoginResponseDto;
import com.example.meetmates.dto.RegisterRequestDto;
import com.example.meetmates.service.AuthService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;
    public AuthController(AuthService authService) { this.authService = authService; }

    // REGISTER
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Void>> register(@RequestBody RegisterRequestDto request) {

        authService.register(request);

        return ResponseEntity.ok(
                new ApiResponse<>("Iiiiiiiiiiiiinscription réussie — vérifiez votre email", null)
        );
    }

    // LOGIN
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponseDto>> login(
            @RequestBody LoginRequestDto request,
            HttpServletResponse response) {

        LoginResponseDto dto = authService.login(request, response);

        return ResponseEntity.ok(
                new ApiResponse<>("Ccccccccccccconnexion réussie",null)
        );
    }

    // VERIFY
    @GetMapping("/verify")
    public ResponseEntity<ApiResponse<Void>> verifyUser(@RequestParam String token) {

        authService.verifyUser(token);

        return ResponseEntity.ok(
                new ApiResponse<>("Ccccccccccccccompte vérifié avec succès", null)
        );
    }

    // LOGOUT
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(HttpServletResponse response) {

        authService.logout(response);

        return ResponseEntity.ok(
                new ApiResponse<>("Déééééééééééééééconnexion réussie", null)
        );
    }

    // REFRESH (filtré)
    @PostMapping("/refresh-token")
    public ResponseEntity<ApiResponse<String>> refreshToken(HttpServletRequest request) {

        return ResponseEntity.ok(
                new ApiResponse<>("Reeeeeeeeeeeeeefresh token traité par le filtre", null)
        );
    }
}
