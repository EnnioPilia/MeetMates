package com.example.meetmates.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.meetmates.dto.UpdateUserDto;
import com.example.meetmates.exception.ApiException;
import com.example.meetmates.exception.ErrorCode;
import com.example.meetmates.mapper.UserMapper;
import com.example.meetmates.model.TokenType;
import com.example.meetmates.model.User;
import com.example.meetmates.model.UserStatus;
import com.example.meetmates.repository.TokenRepository;
import com.example.meetmates.repository.UserRepository;

import lombok.extern.slf4j.Slf4j;

/**
 * Service pour la gestion des utilisateurs.
 * Fournit des méthodes pour :
 * - récupérer, créer et mettre à jour des utilisateurs
 * - gérer la suppression soft et hard
 * - charger un utilisateur pour Spring Security
 */
@Slf4j
@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final TokenRepository tokenRepository;
    private final UserMapper userMapper;

    public UserService(UserRepository userRepository,
                       TokenRepository tokenRepository,
                       UserMapper userMapper) {
        this.userRepository = userRepository;
        this.tokenRepository = tokenRepository;
        this.userMapper = userMapper;
    }

    /**
     * Retourne tous les utilisateurs actifs (non supprimés).
     *
     * @return liste des utilisateurs
     */
    @Transactional(readOnly = true)
    public List<User> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .filter(u -> u.getDeletedAt() == null)
                .toList();
    }

    /**
     * Récupère un utilisateur actif par email ou lance une exception.
     *
     * @param email l’email de l’utilisateur
     * @return l’utilisateur correspondant
     * @throws ApiException si l’utilisateur n’existe pas ou est supprimé
     */
    @Transactional(readOnly = true)
    public User findActiveByEmailOrThrow(String email) {
        return userRepository.findByEmailAndDeletedAtIsNull(email.toLowerCase())
                .orElseThrow(() -> new ApiException(ErrorCode.USER_NOT_FOUND));
    }

    /**
     * Sauvegarde un utilisateur en base.
     *
     * @param user l’utilisateur à sauvegarder
     * @return l’utilisateur sauvegardé
     */
    @Transactional
    public User saveUser(User user) {
        return userRepository.save(user);
    }

    /**
     * Charge un utilisateur pour Spring Security à partir de son email.
     *
     * @param email l’email de l’utilisateur
     * @return UserDetails utilisé par Spring Security
     * @throws ApiException si l’utilisateur n’existe pas, est banni ou désactivé
     */
    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String email) {
        User user = userRepository.findByEmail(email.toLowerCase())
                .orElseThrow(() -> new ApiException(ErrorCode.USER_NOT_FOUND));

        if (user.getStatus() == UserStatus.BANNED) {
            throw new ApiException(ErrorCode.USER_BANNED);
        }

        if (!user.isEnabled()) {
            throw new ApiException(ErrorCode.USER_DISABLED);
        }

        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .roles(user.getRole().name())
                .build();
    }

    /**
     * Met à jour le profil d’un utilisateur avec les informations fournies.
     *
     * @param user l’utilisateur à mettre à jour
     * @param dto les nouvelles informations
     * @return l’utilisateur mis à jour
     * @throws ApiException si l’utilisateur est null
     */
    @Transactional
    public User updateProfile(User user, UpdateUserDto dto) {
        if (user == null) {
            throw new ApiException(ErrorCode.USER_NOT_FOUND);
        }
        userMapper.updateFromDto(dto, user);
        return userRepository.save(user);
    }

    /**
     * Supprime l’URL de la photo de profil d’un utilisateur.
     *
     * @param user l’utilisateur concerné
     * @return l’utilisateur mis à jour
     * @throws ApiException si l’utilisateur est null
     */
    @Transactional
    public User clearProfilePicture(User user) {
        if (user == null) {
            throw new ApiException(ErrorCode.USER_NOT_FOUND);
        }
        user.setProfilePictureUrl(null);
        return userRepository.save(user);
    }

    /**
     * Supprime définitivement un utilisateur par son ID (hard delete).
     * Supprime aussi tous ses tokens associés.
     *
     * @param userId l’ID de l’utilisateur
     * @return true si la suppression a réussi
     * @throws ApiException si l’utilisateur n’existe pas
     */
    @Transactional
    public boolean hardDeleteById(UUID userId) {

        if (!userRepository.existsById(userId)) {
            throw new ApiException(ErrorCode.USER_NOT_FOUND);
        }

        tokenRepository.deleteByUser_IdAndType(userId, TokenType.REFRESH);
        tokenRepository.deleteByUser_IdAndType(userId, TokenType.VERIFICATION);
        tokenRepository.deleteByUser_IdAndType(userId, TokenType.PASSWORD_RESET);

        userRepository.deleteById(userId);
        return true;
    }

    /**
     * Supprime un utilisateur de façon logique (soft delete) en marquant la date
     * de suppression et en désactivant son compte.
     * Supprime également tous les tokens existants.
     *
     * @param email l’email de l’utilisateur à supprimer
     * @return true si la suppression a réussi
     * @throws ApiException si l’utilisateur n’existe pas
     */
    @Transactional
    public boolean softDeleteByEmail(String email) {
        User user = userRepository.findByEmailAndDeletedAtIsNull(email.toLowerCase())
                .orElseThrow(() -> new ApiException(ErrorCode.USER_NOT_FOUND));

        tokenRepository.deleteByUser_Id(user.getId());
        if (user.getTokens() != null) {
            user.getTokens().clear();
        }

        user.setDeletedAt(LocalDateTime.now());
        user.setStatus(UserStatus.DELETED);
        user.setEnabled(false);

        userRepository.save(user);
        log.info("Soft delete réussi pour user={} email={}", user.getId(), email);
        return true;
    }
}
