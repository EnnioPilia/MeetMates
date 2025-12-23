package com.example.meetmates.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.meetmates.dto.ApiResponse;
import com.example.meetmates.dto.UpdateUserDto;
import com.example.meetmates.dto.UserDto;
import com.example.meetmates.mapper.UserMapper;
import com.example.meetmates.model.User;
import com.example.meetmates.service.CookieService;
import com.example.meetmates.service.MessageService;
import com.example.meetmates.service.UserService;

import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

/**
 * Contrôleur gérant les opérations liées aux utilisateurs.
 *
 * Fournit plusieurs endpoints pour : 
 * - consulter son profil ou la liste des utilisateurs (admin) 
 * - mettre à jour ses informations personnelles 
 * - gérer sa photo de profil - supprimer son compte ou un utilisateur (admin)
 *
 * Ce contrôleur se limite à la gestion des requêtes HTTP et délègue l’ensemble
 * de la logique métier aux services applicatifs.
 *
 * Utilise ApiResponse pour garantir une structure uniforme des retours. Les
 * messages utilisateurs sont centralisés via MessageService, lequel lit les
 * codes dans le fichier messages.properties (i18n).
 */
@Slf4j
@RestController
@RequestMapping("/user")
public class UserController {

    private final UserService userService;
    private final UserMapper userMapper;
    private final CookieService cookieService;
    private final MessageService messageService;

    /**
     * Injection des dépendances nécessaires au contrôleur.
     *
     * @param userService service métier de gestion des utilisateurs
     * @param userMapper mapper entité / DTO
     * @param cookieService gestion des cookies d’authentification
     * @param messageService gestion des messages utilisateurs (i18n)
     */
    public UserController(
            UserService userService,
            UserMapper userMapper,
            CookieService cookieService,
            MessageService messageService) {
        this.userService = userService;
        this.userMapper = userMapper;
        this.cookieService = cookieService;
        this.messageService = messageService;
    }

    /**
     * Récupère tous les utilisateurs (admin uniquement). Sécurisé par une règle
     * custom : seul un administrateur peut effectuer cette action.
     *
     * @return liste complète des utilisateurs
     */
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<ApiResponse<List<UserDto>>> getAllUsers() {
        log.info("Demande de récupération de tous les utilisateurs reçue");
        List<UserDto> dtos = userService.getAllUsers()
                .stream()
                .map(userMapper::toDto)
                .toList();

        log.info("Liste des utilisateurs récupérée ({} utilisateurs)", dtos.size());
        String message = messageService.get("USER_GET_ALL_SUCCESS");
        return ResponseEntity.ok(new ApiResponse<>(message, dtos));
    }

    /**
     * Récupère les informations de l’utilisateur connecté.
     *
     * @param userDetails utilisateur authentifié
     * @return informations du profil
     */
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserDto>> getMe(
            @AuthenticationPrincipal UserDetails userDetails) {

        log.info("Demande de récupération du profil utilisateur");
        User user = userService.findActiveByEmailOrThrow(userDetails.getUsername());

        String message = messageService.get("USER_GET_ME_SUCCESS");
        return ResponseEntity.ok(new ApiResponse<>(message, userMapper.toDto(user)));
    }

    /**
     * Upload une nouvelle photo de profil pour l’utilisateur connecté.
     *
     * L’ancienne photo principale est désactivée (historique conservé), et une
     * nouvelle entité PictureUser est créée et définie comme photo principale.
     *
     * La validation du fichier et la gestion du stockage sont entièrement
     * déléguées au service métier.
     *
     * @param userDetails utilisateur authentifié
     * @param file fichier image envoyé
     * @return profil utilisateur mis à jour
     */
    @PreAuthorize("isAuthenticated()")
    @PostMapping("/me/picture")
    public ResponseEntity<ApiResponse<UserDto>> uploadProfilePicture(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam("file") MultipartFile file) {

        log.info("Demande de mise à jour de la photo de profil reçue");

        // Toute la logique est maintenant dans le service
        User updated = userService.updateMyProfilePicture(userDetails.getUsername(), file);

        log.info("Photo de profil mise à jour");
        String message = messageService.get("USER_PICTURE_UPLOAD_SUCCESS");
        return ResponseEntity.ok(new ApiResponse<>(message, userMapper.toDto(updated)));
    }

    /**
     * Met à jour les informations du profil utilisateur.
     *
     * @param dto données modifiées
     * @param userDetails utilisateur connecté
     * @return profil mis à jour
     */
    @PreAuthorize("isAuthenticated()")
    @PutMapping("/me")
    public ResponseEntity<ApiResponse<UserDto>> updateMyProfile(
            @RequestBody UpdateUserDto dto,
            @AuthenticationPrincipal UserDetails userDetails) {

        log.info("Demande de mise à jour du profil utilisateur");
        User user = userService.findActiveByEmailOrThrow(userDetails.getUsername());
        User updated = userService.updateProfile(user, dto);

        log.info("Profil utilisateur mis à jour");
        String message = messageService.get("USER_PROFILE_UPDATE_SUCCESS");
        return ResponseEntity.ok(new ApiResponse<>(message, userMapper.toDto(updated)));
    }

    /**
     * Supprime définitivement un utilisateur. Sécurisé par une règle custom :
     * seul un administrateur peut effectuer cette action.
     *
     * @param id identifiant de l’utilisateur à supprimer
     * @return confirmation de suppression
     */
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable UUID id) {
        log.info("Demande de suppression d’un utilisateur reçue");
        userService.hardDeleteById(id);

        log.info("Utilisateur supprimé définitivement");
        String message = messageService.get("USER_DELETE_SUCCESS");
        return ResponseEntity.ok(new ApiResponse<>(message, null));
    }

    /**
     * Désactive la photo de profil principale de l’utilisateur connecté (soft
     * delete).
     *
     * La photo n’est pas supprimée de la base de données : elle est simplement
     * marquée comme inactive afin de conserver l’historique.
     *
     * @param userDetails utilisateur connecté
     * @return profil mis à jour sans photo
     */
    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/me/picture")
    public ResponseEntity<ApiResponse<UserDto>> deleteProfilePicture(
            @AuthenticationPrincipal UserDetails userDetails) {

        log.info("Demande de suppression de la photo de profil reçue");

        User updated = userService.deleteMyProfilePicture(userDetails.getUsername());

        log.info("Photo de profil supprimée");
        String message = messageService.get("USER_PICTURE_DELETE_SUCCESS");
        return ResponseEntity.ok(new ApiResponse<>(message, userMapper.toDto(updated)));
    }

    /**
     * Supprime le compte de l’utilisateur connecté (soft delete) et invalide
     * les cookies d’authentification.
     *
     * @param userDetails utilisateur connecté
     * @param response contexte HTTP pour nettoyer les cookies
     * @return confirmation de suppression
     */
    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/me")
    public ResponseEntity<ApiResponse<Void>> deleteMyAccount(
            @AuthenticationPrincipal UserDetails userDetails,
            HttpServletResponse response) {

        log.info("Demande de suppression du compte reçue");
        userService.softDeleteByEmail(userDetails.getUsername());
        cookieService.clearAuthCookies(response);

        log.info("Compte supprimé (soft delete) et cookies d’authentification nettoyés");
        String message = messageService.get("USER_DELETE_ACCOUNT_SUCCESS");
        return ResponseEntity.ok(new ApiResponse<>(message, null));
    }

}
