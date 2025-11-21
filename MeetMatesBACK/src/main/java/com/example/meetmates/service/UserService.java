package com.example.meetmates.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.meetmates.dto.UpdateUserDto;
import com.example.meetmates.dto.UserDto;
import com.example.meetmates.exception.UserDisabledException;
import com.example.meetmates.exception.UserNotFoundException;
import com.example.meetmates.mapper.UserMapper;
import com.example.meetmates.model.TokenType;
import com.example.meetmates.model.User;
import com.example.meetmates.model.UserStatus;
import com.example.meetmates.repository.TokenRepository;
import com.example.meetmates.repository.UserRepository;

@Service
public class UserService implements UserDetailsService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;
    private final TokenRepository tokenRepository;
    private final UserMapper userMapper;

    @Autowired
    public UserService(UserRepository userRepository,
            TokenRepository tokenRepository,
            UserMapper userMapper) {
        this.userRepository = userRepository;
        this.tokenRepository = tokenRepository;
        this.userMapper = userMapper;
    }

    // * Met à jour un utilisateur existant
    public User updateUser(User user) {
        logger.info("Mise à jour de l'utilisateur {}", user.getId());
        return userRepository.save(user);
    }

    // * Récupère tous les utilisateurs
    @Transactional(readOnly = true)
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // * Rechercher un utilisateur par email (normalisé)
    @Transactional(readOnly = true)
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email.toLowerCase());
    }

    // * Recherche un utilisateur par ID
    @Transactional(readOnly = true)
    public Optional<User> findById(UUID id) {
        return userRepository.findById(id);
    }

    // * Recherche un user + relations associées (chargement eager)
    @Transactional(readOnly = true)
    public Optional<User> findByEmailEager(String email) {
        return userRepository.findByEmailEager(email.toLowerCase());
    }

    // * Méthode utilisée par Spring Security pour authentifier un utilisateur
    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        User user = userRepository.findByEmail(email.toLowerCase())
                .orElseThrow(() -> {
                    logger.warn("Tentative de connexion avec email inconnu : {}", email);
                    return new UserNotFoundException("❌ Utilisateur non trouvé");
                });

        if (user.getStatus() == UserStatus.DELETED) {
            logger.warn("Tentative de connexion utilisateur supprimé : {}", email);
            throw new UserDisabledException("❌ Compte supprimé");
        }

        if (user.getStatus() == UserStatus.BANNED) {
            logger.warn("Tentative de connexion utilisateur banni : {}", email);
            throw new UserDisabledException("❌ Utilisateur banni");
        }

        if (!user.isEnabled()) {
            logger.warn("Tentative de connexion utilisateur non activé : {}", email);
            throw new UserDisabledException("❌ Compte non vérifié");
        }

        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .roles(user.getRole().name())
                .build();
    }

    // * Mise à jour du profil utilisateur connecté
    @Transactional
    public UserDto updateMyProfile(String email, UpdateUserDto dto) {

        User user = userRepository.findByEmail(email.toLowerCase())
                .orElseThrow(() -> new UserNotFoundException("❌ Utilisateur introuvable"));

        logger.info("[PROFILE] Mise à jour du profil user={} email={}", user.getId(), user.getEmail());

        if (dto.getFirstName() != null) {
            user.setFirstName(dto.getFirstName());
        }
        if (dto.getLastName() != null) {
            user.setLastName(dto.getLastName());
        }
        if (dto.getAge() != null && dto.getAge() >= 13) {
            user.setAge(dto.getAge());
        }
        if (dto.getCity() != null) {
            user.setCity(dto.getCity());
        }
        if (dto.getProfilePictureUrl() != null) {
            user.setProfilePictureUrl(dto.getProfilePictureUrl());
        }

        userRepository.save(user);

        return userMapper.toDto(user);
    }

    // * Hard delete: Supprime totalement un utilisateur + ses tokens
    @Transactional
    public boolean deleteUserById(UUID userId) {

        logger.warn("Suppression définitive de l'utilisateur {}", userId);

        tokenRepository.deleteByUser_IdAndType(userId, TokenType.REFRESH);
        tokenRepository.deleteByUser_IdAndType(userId, TokenType.VERIFICATION);
        tokenRepository.deleteByUser_IdAndType(userId, TokenType.PASSWORD_RESET);

        if (userRepository.existsById(userId)) {
            userRepository.deleteById(userId);
            return true;
        }
        return false;
    }

    // * Soft delete: désactive le compte de l'utilisateur connecté
    @Transactional
    public boolean deleteMyAccount(String email) {

        Optional<User> userOpt = userRepository.findByEmailAndDeletedAtIsNull(email.toLowerCase());
        if (userOpt.isEmpty()) {
            return false;
        }

        User user = userOpt.get();

        logger.warn("Soft-delete du compte utilisateur {}", user.getId());

        user.setDeletedAt(LocalDateTime.now());
        user.setStatus(UserStatus.DELETED);
        user.setEnabled(false);

        if (user.getTokens() != null) {
            user.getTokens().clear();
        }

        userRepository.save(user);
        return true;
    }
}
