package com.example.meetmates.controller;

import java.io.IOException;
import java.security.Principal;
import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
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
import com.example.meetmates.exception.UserNotFoundException;
import com.example.meetmates.mapper.UserMapper;
import com.example.meetmates.model.User;
import com.example.meetmates.service.CookieService;
import com.example.meetmates.service.PictureService;
import com.example.meetmates.service.UserService;

import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/user")
public class UserController {

    private final UserService userService;
    private final PictureService pictureService;
    private final UserMapper userMapper;
    private final CookieService cookieService;

    public UserController(UserService userService,
            PictureService pictureService,
            UserMapper userMapper,
            CookieService cookieService) {
        this.userService = userService;
        this.pictureService = pictureService;
        this.userMapper = userMapper;
        this.cookieService = cookieService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<UserDto>>> getAllUsers() {
        log.info("[USER] Récupération de tous les utilisateurs");
        List<User> users = userService.getAllUsers();
        List<UserDto> dtos = users.stream().map(userMapper::toDto).toList();
        return ResponseEntity.ok(new ApiResponse<>("Liste des utilisateurs", dtos));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserDto>> getMe(Authentication authentication) {
        log.info("[USER] Récupération du profil de l'utilisateur connecté");

        String email = authentication.getName();
        User user = userService.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("Utilisateur non trouvé"));

        return ResponseEntity.ok(new ApiResponse<>("Profil utilisateur", userMapper.toDto(user)));
    }

    @PostMapping("/me/picture")
    public ResponseEntity<ApiResponse<UserDto>> uploadProfilePicture(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam("file") MultipartFile file) throws IOException {

        log.info("[USER] Upload photo de profil");

        if (userDetails == null) {
            log.warn("[USER] Upload refusé : utilisateur non authentifié");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse<>("Utilisateur non authentifié"));
        }

        User user = userService.findActiveByEmailOrThrow(userDetails.getUsername());

        String imageUrl = pictureService.uploadProfilePicture(file);
        user.setProfilePictureUrl(imageUrl);
        userService.saveUser(user);

        log.info("[USER] Photo mise à jour pour {}", user.getEmail());

        return ResponseEntity.ok(new ApiResponse<>("Photo mise à jour", userMapper.toDto(user)));
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<UserDto>> updateMyProfile(
            @RequestBody UpdateUserDto updateUserDto,
            Principal principal) {

        log.info("[USER] Mise à jour du profil pour {}", principal.getName());

        User user = userService.findActiveByEmailOrThrow(principal.getName());
        User updated = userService.updateProfile(user, updateUserDto);

        return ResponseEntity.ok(new ApiResponse<>("Profil mis à jour", userMapper.toDto(updated)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable UUID id) {
        log.warn("[ADMIN] Suppression de l'utilisateur {}", id);
        boolean deleted = userService.hardDeleteById(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>("Utilisateur introuvable"));
        }
    }

    @DeleteMapping("/me/picture")
    public ResponseEntity<ApiResponse<UserDto>> deleteProfilePicture(
            @AuthenticationPrincipal UserDetails userDetails) {

        log.info("[USER] Suppression photo de profil");

        User user = userService.findActiveByEmailOrThrow(userDetails.getUsername());

        pictureService.deleteUserProfilePicture(user);
        User updated = userService.clearProfilePicture(user);

        return ResponseEntity.ok(new ApiResponse<>("Photo supprimée", userMapper.toDto(updated)));
    }

    @DeleteMapping("/me")
    public ResponseEntity<ApiResponse<Void>> deleteMyAccount(
            @AuthenticationPrincipal UserDetails userDetails,
            HttpServletResponse response) {

        log.warn("[USER] Suppression du compte demandée");

        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse<>("Utilisateur non authentifié"));
        }

        boolean deleted = userService.softDeleteByEmail(userDetails.getUsername());

        if (deleted) {
            cookieService.clearAuthCookies(response);
            return ResponseEntity.ok(new ApiResponse<>("Compte supprimé avec succès"));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>("Utilisateur introuvable"));
        }
    }
}
