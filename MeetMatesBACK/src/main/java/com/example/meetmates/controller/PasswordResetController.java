package com.example.meetmates.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.meetmates.dto.ApiResponse;
import com.example.meetmates.dto.PasswordResetConfirmDto;
import com.example.meetmates.dto.PasswordResetRequestDto;
import com.example.meetmates.service.MessageService;
import com.example.meetmates.service.PasswordResetService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/auth")
public class PasswordResetController {

    private final PasswordResetService passwordResetService;
    private final MessageService messageService;

    public PasswordResetController(PasswordResetService passwordResetService,
                                   MessageService messageService) {
        this.passwordResetService = passwordResetService;
        this.messageService = messageService;
    }

    @PostMapping("/request-reset")
    public ResponseEntity<ApiResponse<Void>> requestReset(@RequestBody PasswordResetRequestDto request) {
        log.info("[PASSWORD] Demande de réinitialisation pour {}", request.getEmail());
        passwordResetService.createPasswordResetToken(request.getEmail());
        log.info("[PASSWORD] Token envoyé pour {}", request.getEmail());

        String message = messageService.get("PASSWORD.RESET.REQUEST_SUCCESS");
        return ResponseEntity.ok(new ApiResponse<>(message, null));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<Void>> resetPassword(@RequestBody PasswordResetConfirmDto dto) {
        log.info("[PASSWORD] Tentative de réinitialisation du mot de passe");
        passwordResetService.resetPassword(dto.getToken(), dto.getNewPassword());
        log.info("[PASSWORD] Mot de passe réinitialisé avec succès");

        String message = messageService.get("PASSWORD.RESET.CONFIRM_SUCCESS");
        return ResponseEntity.ok(new ApiResponse<>(message, null));
    }
}
