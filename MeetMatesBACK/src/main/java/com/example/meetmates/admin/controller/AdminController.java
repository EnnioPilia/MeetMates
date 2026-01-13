package com.example.meetmates.admin.controller;

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

import com.example.meetmates.admin.service.AdminEventService;
import com.example.meetmates.admin.service.AdminUserService;
import com.example.meetmates.common.dto.ApiResponse;
import com.example.meetmates.common.service.MessageService;
import com.example.meetmates.event.dto.EventResponseDto;
import com.example.meetmates.user.dto.UserDto;
import com.example.meetmates.user.mapper.UserMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Contrôleur REST dédié aux opérations d’administration.
 *
 * Fournit plusieurs endpoints pour :
 *  - gérer les utilisateurs (consultation, suppression logique, restauration, suppression définitive)
 *  - gérer les événements (consultation globale, suppression logique, restauration, suppression définitive)
 *
 * Tous les endpoints sont réservés aux utilisateurs disposant du rôle ADMIN.
 *
 * Utilise ApiResponse pour garantir une structure uniforme des retours.
 * Les messages utilisateurs sont centralisés via MessageService,
 * lequel lit les codes dans le fichier messages.properties (i18n).
 */
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

    /**
     * Récupère tous les utilisateurs (admin uniquement). Sécurisé par une règle
     * custom : seul un administrateur peut effectuer cette action.
     *
     * @return liste complète des utilisateurs
     */
    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserDto>>> getAllUsers() {
        log.info("ADMIN – récupération de tous les utilisateurs");

        List<UserDto> users = adminUserService.getAllUsersIncludingDeleted() 
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

    /**
     * Supprime un utilisateur de manière logique (soft delete).
     * L’utilisateur est désactivé mais conservé en base de données.
     *
     * @param id identifiant UUID de l’utilisateur
     * @return message de confirmation
     */
    @DeleteMapping("/users/{id}")
    public ResponseEntity<ApiResponse<Void>> softDeleteUser(@PathVariable UUID id) {
        log.info("ADMIN – soft delete utilisateur {}", id);

        adminUserService.softDeleteUser(id);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        messageService.get("ADMIN_USER_SOFT_DELETE_SUCCESS"),
                        null
                )
        );
    }

    /**
     * Restaure un utilisateur précédemment supprimé logiquement.
     *
     * @param id identifiant UUID de l’utilisateur
     * @return message de confirmation
     */
    @PutMapping("/users/{id}/restore")
    public ResponseEntity<ApiResponse<Void>> restoreUser(@PathVariable UUID id) {
        log.info("ADMIN – restore utilisateur {}", id);

        adminUserService.restoreUser(id);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        messageService.get("ADMIN_USER_RESTORE_SUCCESS"),
                        null
                )
        );
    }

    /**
     * Supprime définitivement un utilisateur (hard delete).
     *
     * @param id identifiant UUID de l’utilisateur
     * @return message de confirmation
     */
    @DeleteMapping("/users/{id}/hard")
    public ResponseEntity<ApiResponse<Void>> hardDeleteUser(@PathVariable UUID id) {
        log.warn("ADMIN – HARD delete utilisateur {}", id);

        adminUserService.hardDeleteUser(id);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        messageService.get("ADMIN_USER_HARD_DELETE_SUCCESS"),
                        null
                )
        );
    }

    /**
     * Récupère la liste complète des événements.
     *
     * @return liste complète des événements
     */
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

    /**
     * Supprime un événement de manière logique (soft delete).
     *
     * L’événement est désactivé mais conservé en base de données.
     *
     * @param eventId identifiant UUID de l’événement
     * @return message de confirmation
     */
    @DeleteMapping("/events/{eventId}")
    public ResponseEntity<ApiResponse<Void>> softDeleteEvent(@PathVariable UUID eventId) {
        log.info("ADMIN – soft delete événement {}", eventId);

        adminEventService.softDeleteEvent(eventId);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        messageService.get("ADMIN_EVENT_SOFT_DELETE_SUCCESS"),
                        null
                )
        );
    }

    /**
     * Supprime définitivement un événement (hard delete).
     * 
     * @param eventId identifiant UUID de l’événement
     * @return message de confirmation
     */
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
    
    /**
     * Restaure un événement précédemment supprimé logiquement.
     *
     * @param eventId identifiant UUID de l’événement
     * @return message de confirmation
     */
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
