package com.example.meetmates.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.meetmates.dto.ApiResponse;
import com.example.meetmates.dto.EventResponseDto;
import com.example.meetmates.dto.UserDto;
import com.example.meetmates.mapper.UserMapper;
import com.example.meetmates.service.AdminEventService;
import com.example.meetmates.service.AdminUserService;
import com.example.meetmates.service.MessageService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminUserService adminUserService;
    private final AdminEventService adminEventService;
    private final UserMapper userMapper;
    private final MessageService messageService;

    /* ===================== USERS ===================== */
    /**
     * Récupère tous les utilisateurs (admin uniquement). Sécurisé par une règle
     * custom : seul un administrateur peut effectuer cette action.
     *
     * @return liste complète des utilisateurs
     */
    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserDto>>> getAllUsers() {
        log.info("ADMIN – récupération de tous les utilisateurs");

        List<UserDto> users = adminUserService.getAllUsersIncludingDeleted() // <-- change ici
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

    @DeleteMapping("/users/{id}")
    public ResponseEntity<ApiResponse<Void>> softDeleteUser(@PathVariable UUID id) {
        log.info("ADMIN – soft delete utilisateur {}", id);

        adminUserService.softDeleteUser(id);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        messageService.get("USER_DELETE_SUCCESS"),
                        null
                )
        );
    }

    @PutMapping("/users/{id}/restore")
    public ResponseEntity<ApiResponse<Void>> restoreUser(@PathVariable UUID id) {
        log.info("ADMIN – restore utilisateur {}", id);

        adminUserService.restoreUser(id);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        messageService.get("USER_RESTORE_SUCCESS"),
                        null
                )
        );
    }

    @DeleteMapping("/users/{id}/hard")
    public ResponseEntity<ApiResponse<Void>> hardDeleteUser(@PathVariable UUID id) {
        log.warn("ADMIN – HARD delete utilisateur {}", id);

        adminUserService.hardDeleteUser(id);

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
                        adminEventService.getAllEvents()
                )
        );
    }

    @DeleteMapping("/events/{eventId}")
    public ResponseEntity<ApiResponse<Void>> softDeleteEvent(@PathVariable UUID eventId) {
        log.info("ADMIN – soft delete événement {}", eventId);

        adminEventService.softDeleteEvent(eventId);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        messageService.get("EVENT_DELETE_SUCCESS"),
                        null
                )
        );
    }

    @DeleteMapping("/events/{eventId}/hard")
    public ResponseEntity<ApiResponse<Void>> hardDeleteEvent(@PathVariable UUID eventId) {
        log.warn("ADMIN – HARD delete événement {}", eventId);

        adminEventService.hardDeleteEvent(eventId);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        messageService.get("ADMIN_EVENT_HARD_DELETE_SUCCESS"),
                        null
                )
        );
    }

    @PutMapping("/events/{eventId}/restore")
    public ResponseEntity<ApiResponse<Void>> restoreEvent(@PathVariable UUID eventId) {
        log.info("ADMIN – restore événement {}", eventId);

        adminEventService.restoreEvent(eventId);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        messageService.get("ADMIN_EVENT_RESTORE_SUCCESS"),
                        null
                )
        );
    }

}
