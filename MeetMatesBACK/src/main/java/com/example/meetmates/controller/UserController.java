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

@RestController
@RequestMapping("/user")
public class UserController {

    private final UserService userService;
    private final PictureService pictureService;
    private final UserMapper userMapper;
    private final CookieService cookieService;
    private final MessageService messageService;

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

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserDto>> getMe(
            @AuthenticationPrincipal UserDetails userDetails) {

        User user = userService.findActiveByEmailOrThrow(userDetails.getUsername());
        String message = messageService.get("USER.GET_ME.SUCCESS");
        return ResponseEntity.ok(new ApiResponse<>(message, userMapper.toDto(user)));
    }

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

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable UUID id) {
        userService.hardDeleteById(id);
        String message = messageService.get("USER.DELETE.SUCCESS");
        return ResponseEntity.ok(new ApiResponse<>(message, null));
    }

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
