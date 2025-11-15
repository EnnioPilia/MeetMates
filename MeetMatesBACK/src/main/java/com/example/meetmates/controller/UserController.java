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

import com.example.meetmates.dto.UpdateUserDto;
import com.example.meetmates.dto.UserDto;
import com.example.meetmates.exception.UserNotFoundException;
import com.example.meetmates.mapper.UserMapper;
import com.example.meetmates.model.User;
import com.example.meetmates.service.PictureService;
import com.example.meetmates.service.UserService;

@RestController
@RequestMapping("/user")
public class UserController {

    private final UserService userService;
    private final PictureService pictureService;
    private final UserMapper userMapper;

    public UserController(UserService userService,
            PictureService pictureService,
            UserMapper userMapper) {
        this.userService = userService;
        this.pictureService = pictureService;
        this.userMapper = userMapper;
    }

    // * Récupère la liste de tous les utilisateurs 
    @GetMapping
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users.stream().map(userMapper::toDto).toList());
    }

    // * Récupère le profil de l'utilisateur connecté
    @GetMapping("/me")
    public ResponseEntity<UserDto> getMe(Authentication authentication) {
        String email = authentication.getName();

        User user = userService.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("Utilisateur non trouvé"));

        return ResponseEntity.ok(userMapper.toDto(user));
    }

    // * Upload une nouvelle photo de profil
    @PostMapping("/me/picture")
    public ResponseEntity<UserDto> uploadProfilePicture(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam("file") MultipartFile file) throws IOException {

        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        User user = userService.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new UserNotFoundException("Utilisateur introuvable"));

        String imageUrl = pictureService.uploadProfilePicture(file);

        user.setProfilePictureUrl(imageUrl);
        userService.updateUser(user);

        return ResponseEntity.ok(userMapper.toDto(user));
    }

    // * Mise à jour du profil utilisateur 
    @PutMapping("/me")
    public ResponseEntity<UserDto> updateMyProfile(
            @RequestBody UpdateUserDto updateUserDto,
            Principal principal) {

        UserDto updatedUser = userService.updateMyProfile(principal.getName(), updateUserDto);
        return ResponseEntity.ok(updatedUser);
    }

    // * Suppression définitive d'un utilisateur (admin)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID id) {
        boolean deleted = userService.deleteUserById(id);
        return deleted
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }

    // * Supprime la photo de profil de l'utilisateur connecté
    @DeleteMapping("/me/picture")
    public ResponseEntity<Void> deleteProfilePicture(
            @AuthenticationPrincipal UserDetails userDetails) {

        User user = userService.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new UserNotFoundException("Utilisateur introuvable"));

        pictureService.deleteUserProfilePicture(user);
        return ResponseEntity.noContent().build();
    }

    // * Supprime son propre compte (soft delete)
    @DeleteMapping("/me")
    public ResponseEntity<Void> deleteMyAccount(
            @AuthenticationPrincipal UserDetails userDetails) {

        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        boolean deleted = userService.deleteMyAccount(userDetails.getUsername());

        return deleted
                ? ResponseEntity.noContent().build()
                : ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
}
