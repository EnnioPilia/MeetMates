package com.example.meetmates.controller;

import java.io.IOException;
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
import com.example.meetmates.service.PictureService;
import com.example.meetmates.service.UserService;

import jakarta.servlet.http.HttpServletResponse;

/**
 * Contrôleur gérant les opérations liées aux utilisateurs.
 *
 * Fournit plusieurs endpoints pour :
 *  - consulter son profil ou la liste des utilisateurs (admin)
 *  - mettre à jour ses informations personnelles
 *  - gérer sa photo de profil
 *  - supprimer son compte ou un utilisateur (admin)
 *
 * Utilise ApiResponse pour garantir une structure uniforme des retours.
 * Les messages utilisateurs sont centralisés via MessageService, lequel lit les codes dans le fichier messages.properties (i18n).
 */
@RestController
@RequestMapping("/user")
public class UserController {

    private final UserService userService;
    private final PictureService pictureService;
    private final UserMapper userMapper;
    private final CookieService cookieService;
    private final MessageService messageService;

    /**
     * Injection des services nécessaires.
     *
     * @param userService gestion des utilisateurs
     * @param pictureService gestion des photos de profil
     * @param userMapper conversion entité/DTO
     * @param cookieService gestion des cookies d’authentification
     * @param messageService gestionnaire des messages utilisateurs
     */
    public UserController(UserService userService,
            PictureService pictureService,
            UserMapper userMapper,
            CookieService cookieService,
            MessageService messageService) {
        this.userService = userService;
        this.pictureService = pictureService;
        this.userMapper = userMapper;
        this.cookieService = cookieService;
        this.messageService = messageService;
    }

    /**
     * Récupère tous les utilisateurs (admin uniquement).
     * Sécurisé par une règle custom : seul un administrateur peut effectuer cette action.
     * 
     * @return liste complète des utilisateurs
     */
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<ApiResponse<List<UserDto>>> getAllUsers() {
        List<UserDto> dtos = userService.getAllUsers()
                .stream()
                .map(userMapper::toDto)
                .toList();

        String message = messageService.get("USER.GET_ALL.SUCCESS");
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

        User user = userService.findActiveByEmailOrThrow(userDetails.getUsername());
        String message = messageService.get("USER.GET_ME.SUCCESS");
        return ResponseEntity.ok(new ApiResponse<>(message, userMapper.toDto(user)));
    }

    /**
     * Met à jour la photo de profil de l’utilisateur.
     *
     * @param userDetails utilisateur connecté
     * @param file fichier image envoyé
     * @return utilisateur mis à jour
     */
    @PreAuthorize("isAuthenticated()")
    @PostMapping("/me/picture")
    public ResponseEntity<ApiResponse<UserDto>> uploadProfilePicture(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam("file") MultipartFile file) throws IOException {

        User user = userService.findActiveByEmailOrThrow(userDetails.getUsername());

        String imageUrl = pictureService.uploadProfilePicture(file);
        user.setProfilePictureUrl(imageUrl);
        userService.saveUser(user);

        String message = messageService.get("USER.PITCURE.UPLOAD.SUCCESS");
        return ResponseEntity.ok(new ApiResponse<>(message, userMapper.toDto(user)));
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

        User user = userService.findActiveByEmailOrThrow(userDetails.getUsername());
        User updated = userService.updateProfile(user, dto);

        String message = messageService.get("USER.PROFILE.UPDATE.SUCCESS");
        return ResponseEntity.ok(new ApiResponse<>(message, userMapper.toDto(updated)));
    }

    /**
     * Supprime définitivement un utilisateur.
     * Sécurisé par une règle custom : seul un administrateur peut effectuer cette action.
     * 
     * @param id identifiant de l’utilisateur à supprimer
     * @return confirmation de suppression
     */
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable UUID id) {
        userService.hardDeleteById(id);
        String message = messageService.get("USER.DELETE.SUCCESS");
        return ResponseEntity.ok(new ApiResponse<>(message, null));
    }

    /**
     * Supprime la photo de profil de l’utilisateur connecté.
     *
     * @param userDetails utilisateur connecté
     * @return profil mis à jour sans photo
     */
    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/me/picture")
    public ResponseEntity<ApiResponse<UserDto>> deleteProfilePicture(
            @AuthenticationPrincipal UserDetails userDetails) {

        User user = userService.findActiveByEmailOrThrow(userDetails.getUsername());
        pictureService.deleteUserProfilePicture(user);
        User updated = userService.clearProfilePicture(user);

        String message = messageService.get("USER.PITCURE.DELETE.SUCCESS");
        return ResponseEntity.ok(new ApiResponse<>(message, userMapper.toDto(updated)));
    }

    /**
     * Supprime le compte de l’utilisateur connecté (soft delete) et invalide les cookies d’authentification.
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

        userService.softDeleteByEmail(userDetails.getUsername());

        cookieService.clearAuthCookies(response);

        String message = messageService.get("USER.DELETE_ACCOUNT.SUCCESS");
        return ResponseEntity.ok(new ApiResponse<>(message, null));
    }

}
