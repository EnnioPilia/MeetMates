package com.example.meetmates.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.meetmates.exception.ApiException;
import com.example.meetmates.exception.ErrorCode;
import com.example.meetmates.model.User;
import com.example.meetmates.model.UserStatus;
import com.example.meetmates.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class AdminUserService {

    private final UserRepository userRepository;

    /* ===================== READ ===================== */
    @Transactional(readOnly = true)
    public List<User> getAllActiveUsers() {
        return userRepository.findAll()
                .stream()
                .filter(u -> u.getDeletedAt() == null)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<User> getAllUsersIncludingDeleted() {
        return userRepository.findAll(); 
    }

    /* ===================== WRITE ===================== */
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

    public void restoreUser(UUID userId) {
        User user = getUser(userId);

        user.setDeletedAt(null);
        user.setEnabled(true);
        user.setStatus(UserStatus.ACTIVE); 

        log.info("ADMIN restored user {}", user.getEmail());
    }

    public void hardDeleteUser(UUID userId) {
        User user = getUser(userId);

        userRepository.delete(user);

        log.warn("ADMIN hard-deleted user {}", user.getEmail());
    }

    /* ===================== PRIVATE ===================== */
    private User getUser(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ApiException(ErrorCode.USER_NOT_FOUND));
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

}
