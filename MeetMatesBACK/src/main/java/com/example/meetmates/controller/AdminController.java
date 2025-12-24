package com.example.meetmates.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.meetmates.dto.ApiResponse;
import com.example.meetmates.dto.EventResponseDto;
import com.example.meetmates.dto.UserDto;
import com.example.meetmates.mapper.UserMapper;
import com.example.meetmates.service.AdminService;
import com.example.meetmates.service.MessageService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;
    private final UserMapper userMapper;
    private final MessageService messageService;

    /* ===================== USERS ===================== */

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserDto>>> getAllUsers() {
        log.info("ADMIN – récupération de tous les utilisateurs");

        List<UserDto> users = adminService.getAllUsers()
                .stream()
                .map(userMapper::toDto)
                .toList();

        return ResponseEntity.ok(
                new ApiResponse<>(
                        messageService.get("USER_GET_ALL_SUCCESS"),
                        users
                )
        );
    }

    /** SOFT DELETE USER */
    @DeleteMapping("/users/{id}")
    public ResponseEntity<ApiResponse<Void>> softDeleteUser(@PathVariable UUID id) {
        log.info("ADMIN – soft delete utilisateur {}", id);

        adminService.softDeleteUser(id);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        messageService.get("USER_DELETE_SUCCESS"),
                        null
                )
        );
    }

    /** HARD DELETE USER */
    @DeleteMapping("/users/{id}/hard")
    public ResponseEntity<ApiResponse<Void>> hardDeleteUser(@PathVariable UUID id) {
        log.warn("ADMIN – HARD delete utilisateur {}", id);

        adminService.hardDeleteUser(id);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        messageService.get("USER_HARD_DELETE_SUCCESS"),
                        null
                )
        );
    }

    /* ===================== EVENTS ===================== */

    @GetMapping("/events")
    public ResponseEntity<ApiResponse<List<EventResponseDto>>> getAllEvents() {
        log.info("ADMIN – récupération de tous les événements");

        return ResponseEntity.ok(
                new ApiResponse<>(
                        messageService.get("EVENT_LIST_SUCCESS"),
                        adminService.getAllEvents()
                )
        );
    }

    /** SOFT DELETE EVENT */
    @DeleteMapping("/events/{eventId}")
    public ResponseEntity<ApiResponse<Void>> softDeleteEvent(@PathVariable UUID eventId) {
        log.info("ADMIN – soft delete événement {}", eventId);

        adminService.softDeleteEvent(eventId);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        messageService.get("EVENT_DELETE_SUCCESS"),
                        null
                )
        );
    }

    /** HARD DELETE EVENT */
    @DeleteMapping("/events/{eventId}/hard")
    public ResponseEntity<ApiResponse<Void>> hardDeleteEvent(@PathVariable UUID eventId) {
        log.warn("ADMIN – HARD delete événement {}", eventId);

        adminService.hardDeleteEvent(eventId);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        messageService.get("EVENT_HARD_DELETE_SUCCESS"),
                        null
                )
        );
    }
}
