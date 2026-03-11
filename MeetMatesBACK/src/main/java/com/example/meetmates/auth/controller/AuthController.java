package com.example.meetmates.auth.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.meetmates.auth.dto.LoginRequestDto;
import com.example.meetmates.auth.dto.LoginResponseDto;
import com.example.meetmates.auth.dto.RegisterRequestDto;
import com.example.meetmates.auth.service.AuthService;
import com.example.meetmates.common.dto.ApiResponse;
import com.example.meetmates.common.service.MessageService;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;

/**
 * Contrôleur gérant toutes les opérations d'authentification :
 *
 * - inscription d'un nouvel utilisateur
 * - connexion et génération des tokens JWT
 * - vérification d'un compte utilisateur via un token envoyé par e-mail
 * - déconnexion (suppression du refresh token en cookie)
 * - rafraîchissement du token d'accès (géré par un filtre)
 *
 * Utilise ApiResponse pour garantir une structure uniforme des retours.
 * Les messages utilisateurs sont centralisés via MessageService, 
 * lequel lit les codes dans le fichier messages.properties (i18n).
 */
@Slf4j
@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;
    private final MessageService messageService;

    /**
     * Injection des services nécessaires.
     *
     * @param authService service contenant la logique d'authentification
     * @param messageService gestionnaire des messages utilisateurs (messages.properties)
     */
    public AuthController(AuthService authService, MessageService messageService) {
        this.authService = authService;
        this.messageService = messageService;
    }

    /**
     * Inscrit un nouvel utilisateur.
     *
     * @param request données d'inscription (email, pseudo, mot de passe, etc.)
     * @return message de confirmation d'inscription
     */
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Void>> register(@Valid @RequestBody RegisterRequestDto request) {
        log.info("[AUTH] register request received");

        String code = authService.register(request); 
        String message = messageService.get(code); 
        
        log.info("[AUTH][REGISTER] register successful");
        return ResponseEntity.status(HttpStatus.CREATED)
                             .body(new ApiResponse<>(message, null));
    }

    /**
     * Authentifie un utilisateur et génère les tokens JWT
     * (access token + refresh token dans un cookie HttpOnly).
     *
     * @param request credentials utilisateur (email + mot de passe)
     * @param response utilisé pour écrire le refresh token dans un cookie
     * @return tokens d'authentification et données utilisateur
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponseDto>> login(
            @Valid @RequestBody LoginRequestDto request,
            HttpServletResponse response) {

        log.info("Login request received");
        LoginResponseDto dto = authService.login(request, response);
        String message = messageService.get("AUTH_LOGIN_SUCCESS");

        log.info("Login successful");
        return ResponseEntity.ok(new ApiResponse<>(message, dto));
    }

    /**
     * Valide un compte utilisateur à partir d'un token reçu par e-mail.
     *
     * @param token token de vérification envoyé au moment de l'inscription
     * @return message indiquant si la vérification a réussi
     */
    @GetMapping("/verify")
    public ResponseEntity<ApiResponse<Void>> verifyUser(@RequestParam String token) {
        log.info("VerifyUser request received");

        String code = authService.verifyUser(token);
        String message = messageService.get(code);

        log.info("VerifyUser successful");
        return ResponseEntity.ok(new ApiResponse<>(message, null));
    }

    /**
     * Déconnecte un utilisateur en supprimant le refresh token (cookie HttpOnly).
     *
     * @param response utilisé pour effacer le cookie côté client
     * @return message de déconnexion réussie
     */    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(HttpServletResponse response) {
        log.info("Logout request received");

        String code = authService.logout(response);
        String message = messageService.get(code);

        log.info("Logout successful");
        return ResponseEntity.ok(new ApiResponse<>(message, null));
    }
    
}
