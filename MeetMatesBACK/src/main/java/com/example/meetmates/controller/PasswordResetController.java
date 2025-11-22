package com.example.meetmates.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.meetmates.dto.MessageResponseDto;
import com.example.meetmates.dto.PasswordResetRequestDto;
import com.example.meetmates.dto.PasswordResetResponseDto;
import com.example.meetmates.service.PasswordResetService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/auth")
public class PasswordResetController {

    private final PasswordResetService passwordResetService;

    public PasswordResetController(PasswordResetService passwordResetService) {
        this.passwordResetService = passwordResetService;
    }

    // * Demande l'envoi d'un email contenant un token de réinitialisation de mot de passe.
    @PostMapping("/request-reset")
    public ResponseEntity<MessageResponseDto> requestReset(@RequestBody PasswordResetRequestDto request) {
        log.info("[PASSWORD] Demande de réinitialisation pour {}", request.getEmail());

        try {
            String message = passwordResetService.createPasswordResetToken(request.getEmail());
            log.info("[PASSWORD] Token envoyé à {}", request.getEmail());
            return ResponseEntity.ok(new MessageResponseDto(message));

        } catch (RuntimeException e) {
            log.warn("[PASSWORD] Échec de création du token : {}", e.getMessage());
            return ResponseEntity.badRequest().body(new MessageResponseDto(e.getMessage()));
        }
    }

    // * Réinitialise le mot de passe d'un utilisateur à partir du token envoyé par email.
    @PostMapping("/reset-password")
    public ResponseEntity<MessageResponseDto> resetPassword(@RequestBody PasswordResetResponseDto dto) {
        log.info("[PASSWORD] Tentative de réinitialisation de mot de passe avec token");

        try {
            String message = passwordResetService.resetPassword(dto.getToken(), dto.getNewPassword());
            log.info("[PASSWORD] Mot de passe réinitialisé avec succès");
            return ResponseEntity.ok(new MessageResponseDto(message));

        } catch (RuntimeException e) {
            log.warn("[PASSWORD] Échec de la réinitialisation : {}", e.getMessage());
            return ResponseEntity.badRequest().body(new MessageResponseDto(e.getMessage()));
        }

    }
 }