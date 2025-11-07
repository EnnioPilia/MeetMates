package com.example.meetmates.controller;

import java.io.IOException;
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

import com.example.meetmates.model.User;
import com.example.meetmates.repository.UserRepository;
import com.example.meetmates.service.PictureService;
import com.example.meetmates.service.UserService;

@RestController
@RequestMapping("/user")
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;
    private final PictureService pictureService;

    public UserController(UserService userService, PictureService pictureService, UserRepository userRepository) {
        this.userService = userService;
        this.userRepository = userRepository;
        this.pictureService = pictureService;

    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(Authentication authentication) {
        String email = authentication.getName();
        return userService.findByEmail(email)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/me")
    public ResponseEntity<User> updateMyProfile(
            @RequestBody User updatedUser,
            Authentication authentication) {

        String email = authentication.getName();

        return userService.findByEmail(email)
                .map(user -> {
                    User saved = userService.updateUser(user.getId(), updatedUser);
                    return ResponseEntity.ok(saved);
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PostMapping("/me/picture")
    public ResponseEntity<User> uploadProfilePicture(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam("file") MultipartFile file) throws IOException {

        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }

        var userOpt = userRepository.findByEmail(userDetails.getUsername());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).build();
        }

        User user = userOpt.get();
        String imageUrl = "https://cdn.meetmates.com/uploads/" + file.getOriginalFilename();

        user.setProfilePictureUrl(imageUrl);
        userRepository.save(user);

        return ResponseEntity.ok(user);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable UUID id) {
        boolean deleted = userService.deleteUserById(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/me/picture")
    public ResponseEntity<Void> deleteProfilePhoto(@AuthenticationPrincipal org.springframework.security.core.userdetails.User principal) {
        User user = userService.findByEmail(principal.getUsername())
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        pictureService.deleteUserProfilePicture(user);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/me")
    public ResponseEntity<Void> deleteMyAccount(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        boolean deleted = userService.deleteMyAccount(userDetails.getUsername());
        if (deleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

}
