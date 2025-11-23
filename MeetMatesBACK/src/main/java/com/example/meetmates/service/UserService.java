package com.example.meetmates.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.meetmates.dto.UpdateUserDto;
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

    public UserService(
            UserRepository userRepository,
            TokenRepository tokenRepository,
            UserMapper userMapper
    ) {
        this.userRepository = userRepository;
        this.tokenRepository = tokenRepository;
        this.userMapper = userMapper;
    }

    @Transactional(readOnly = true)
    public List<User> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .filter(u -> u.getDeletedAt() == null)
                .toList();
    }

    @Transactional(readOnly = true)
    public Optional<User> findByEmail(String email) {
        if (email == null) return Optional.empty();
        return userRepository.findByEmail(email.toLowerCase());
    }

    @Transactional(readOnly = true)
    public User findActiveByEmailOrThrow(String email) {
        return userRepository.findByEmailAndDeletedAtIsNull(email.toLowerCase())
                .orElseThrow(() -> new UserNotFoundException("Utilisateur non trouvé"));
    }

    @Transactional
    public User saveUser(User user) {
        return userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public Optional<User> findById(UUID id) {
        return userRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        User user = userRepository.findByEmail(email.toLowerCase())
                .orElseThrow(() -> {
                    logger.warn("Authentication failed: unknown email");
                    return new UserNotFoundException("Utilisateur non trouvé");
                });

        if (user.getStatus() == UserStatus.BANNED) {
            logger.warn("Authentication blocked: banned user {}", user.getId());
            throw new UserDisabledException("Utilisateur banni");
        }

        if (!user.isEnabled()) {
            logger.warn("Authentication blocked: not activated user {}", user.getId());
            throw new UserDisabledException("Votre compte n'est pas activé");
        }

        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .roles(user.getRole().name())
                .build();
    }

    /* ----- Méthodes métier utilisées par le controller ----- */

    /**
     * Mise à jour du profil pour l'utilisateur donné (entité).
     * Le controller récupère l'entité, appelle cette méthode avec le DTO (ou inverse).
     */
    @Transactional
    public User updateProfile(User user, UpdateUserDto dto) {
        if (user == null) throw new IllegalArgumentException("user must not be null");
        userMapper.updateFromDto(dto, user);
        return userRepository.save(user);
    }

    /**
     * Supprime l'image de profil côté stockage et réinitialise l'url côté user.
     * La suppression physique du fichier est déléguée à PictureService par le controller habituellement.
     */
    @Transactional
    public User clearProfilePicture(User user) {
        if (user == null) throw new IllegalArgumentException("user must not be null");
        user.setProfilePictureUrl(null);
        return userRepository.save(user);
    }

    /**
     * Hard delete: supprime l'utilisateur et ses tokens (admin).
     */
    @Transactional
    public boolean hardDeleteById(UUID userId) {
        logger.warn("Hard delete user {}", userId);

        tokenRepository.deleteByUser_IdAndType(userId, TokenType.REFRESH);
        tokenRepository.deleteByUser_IdAndType(userId, TokenType.VERIFICATION);
        tokenRepository.deleteByUser_IdAndType(userId, TokenType.PASSWORD_RESET);

        if (userRepository.existsById(userId)) {
            userRepository.deleteById(userId);
            return true;
        }
        return false;
    }

    /**
     * Soft delete (user désactive son compte) : supprime tokens, marque deletedAt, désactive.
     */
    @Transactional
    public boolean softDeleteByEmail(String email) {
        Optional<User> userOpt = userRepository.findByEmailAndDeletedAtIsNull(email.toLowerCase());
        if (userOpt.isEmpty()) {
            return false;
        }

        User user = userOpt.get();
        logger.warn("Soft delete user {}", user.getId());

        tokenRepository.deleteByUser_Id(user.getId());
        if (user.getTokens() != null) user.getTokens().clear();

        user.setDeletedAt(LocalDateTime.now());
        user.setStatus(UserStatus.DELETED);
        user.setEnabled(false);

        userRepository.save(user);
        return true;
    }
}
