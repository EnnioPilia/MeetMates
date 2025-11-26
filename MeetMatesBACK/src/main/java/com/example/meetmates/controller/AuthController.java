package com.example.meetmates.controller;

import org.springframework.http.HttpStatus;
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
import com.example.meetmates.service.MessageService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;
    private final MessageService messageService;

    public AuthController(AuthService authService, MessageService messageService) {
        this.authService = authService;
        this.messageService = messageService;
    }

    // REGISTER -> retourne 201 Created
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Void>> register(@Valid @RequestBody RegisterRequestDto request) {
        String code = authService.register(request); // code renvoyé par le service
        String message = messageService.get(code);   // message depuis messages.properties
        return ResponseEntity.status(HttpStatus.CREATED)
                             .body(new ApiResponse<>(message, null));
    }

    // LOGIN
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponseDto>> login(
            @Valid @RequestBody LoginRequestDto request,
            HttpServletResponse response) {

        LoginResponseDto dto = authService.login(request, response);
        String message = messageService.get("auth.login.success");
        return ResponseEntity.ok(new ApiResponse<>(message, dto));
    }

    // VERIFY
    @GetMapping("/verify")
    public ResponseEntity<ApiResponse<Void>> verifyUser(@RequestParam String token) {
        String code = authService.verifyUser(token);
        String message = messageService.get(code);
        return ResponseEntity.ok(new ApiResponse<>(message, null));
    }

    // LOGOUT
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(HttpServletResponse response) {
        String code = authService.logout(response);
        String message = messageService.get(code);
        return ResponseEntity.ok(new ApiResponse<>(message, null));
    }

    // REFRESH TOKEN (géré par le filtre JWT)
    @PostMapping("/refresh-token")
    public ResponseEntity<ApiResponse<String>> refreshToken(HttpServletRequest request) {
        String message = messageService.get("auth.refresh.handled_by_filter");
        return ResponseEntity.ok(new ApiResponse<>(message, null));
    }
}
