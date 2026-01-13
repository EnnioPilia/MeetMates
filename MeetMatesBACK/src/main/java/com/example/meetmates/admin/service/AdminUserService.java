package com.example.meetmates.admin.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.meetmates.common.exception.ApiException;
import com.example.meetmates.common.exception.ErrorCode;
import com.example.meetmates.user.model.User;
import com.example.meetmates.user.model.UserStatus;
import com.example.meetmates.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Service métier dédié à l’administration des utilisateurs.
 *
 * Fournit aux administrateurs les fonctionnalités permettant de :
 *  - consulter les utilisateurs (actifs ou supprimés)
 *  - bannir un utilisateur via une suppression logique
 *  - restaurer un utilisateur précédemment banni
 *  - supprimer définitivement un utilisateur
 *
 * Les opérations critiques modifiant l’état des comptes sont journalisées.
 * La sécurité d’accès est appliquée au niveau du contrôleur.
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class AdminUserService {

    private final UserRepository userRepository;

    /**
     * Récupère la liste des utilisateurs actifs.
     *
     * @return liste des utilisateurs actifs
     */
    @Transactional(readOnly = true)
    public List<User> getAllActiveUsers() {
        return userRepository.findAll()
                .stream()
                .filter(u -> u.getDeletedAt() == null)
                .toList();
    }

    /**
     * Récupère l’ensemble des utilisateurs, y compris ceux supprimés logiquement.
     *
     * @return liste complète des utilisateurs
     */
    @Transactional(readOnly = true)
    public List<User> getAllUsersIncludingDeleted() {
        return userRepository.findAll(); 
    }

    /**
     * Supprime un utilisateur de manière logique.
     *
     * Cette opération correspond à un bannissement :
     *  - la date de suppression est renseignée
     *  - le compte est désactivé
     *  - le statut utilisateur passe à BANNED
     *
     * Si l’utilisateur est déjà supprimé, l’opération est ignorée.
     *
     * @param userId identifiant UUID de l’utilisateur
     */
    public void softDeleteUser(UUID userId) {
        User user = getUser(userId);

        if (user.getDeletedAt() != null) {
            return;
        }

        user.setDeletedAt(LocalDateTime.now());
        user.setEnabled(false);
        user.setStatus(UserStatus.BANNED);

        log.warn("ADMIN soft-deleted (banned) user {}", user.getEmail());
    }

    /**
     * Restaure un utilisateur précédemment supprimé logiquement.
     *
     * @param userId identifiant UUID de l’utilisateur
     */
    public void restoreUser(UUID userId) {
        User user = getUser(userId);

        user.setDeletedAt(null);
        user.setEnabled(true);
        user.setStatus(UserStatus.ACTIVE); 

        log.info("ADMIN restored user {}", user.getEmail());
    }

    /**
     * Supprime définitivement un utilisateur (hard delete)...
     * 
     * @param userId identifiant UUID de l’utilisateur
     */
    public void hardDeleteUser(UUID userId) {
        User user = getUser(userId);

        userRepository.delete(user);

        log.warn("ADMIN hard-deleted user {}", user.getEmail());
    }

    /**
     * Récupère un utilisateur à partir de son identifiant.
     *
     * Lance une exception métier si l’utilisateur n’existe pas.
     *
     * @param userId identifiant UUID de l’utilisateur
     * @return utilisateur correspondant
     * @throws ApiException si l’utilisateur est introuvable
     */
    private User getUser(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ApiException(ErrorCode.USER_NOT_FOUND));
    }

    /**
     * Récupère la liste des utilisateurs non supprimés.
     *
     * @return liste des utilisateurs actifs
     */
    @Transactional(readOnly = true)
    public List<User> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .filter(u -> u.getDeletedAt() == null)
                .toList();
    }

}
