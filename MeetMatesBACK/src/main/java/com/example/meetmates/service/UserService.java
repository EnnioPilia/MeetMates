package com.example.meetmates.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.meetmates.model.TokenType;
import com.example.meetmates.model.User;
import com.example.meetmates.model.UserStatus;
import com.example.meetmates.repository.EventRepository;
import com.example.meetmates.repository.TokenRepository;
import com.example.meetmates.repository.UserRepository;

@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final TokenRepository tokenRepository;

    @Autowired
    public UserService(UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            TokenRepository tokenRepository,
            EventRepository eventRepository) {
        this.userRepository = userRepository;
        this.tokenRepository = tokenRepository;

    }

// 🔸 Ajouter des exceptions personnalisées (plus clean pour la gestion d’erreurs).
// 🔸 Annoter les méthodes de lecture avec @Transactional(readOnly = true).
// 🔸 Logger les actions sensibles (deleteUserById, register, etc.).
// 🔸 Tester la cohérence entre UserStatus et enabled (par ex., ne pas avoir ACTIVE mais enabled = false sauf au moment de la vérification de mail).
    public User updateUser(User user) {
        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email.toLowerCase());
    }

    public Optional<User> findById(UUID id) {
        return userRepository.findById(id);
    }

    public User save(User user) {
        return userRepository.save(user);
    }

    public Optional<User> findByEmailEager(String email) {
        return userRepository.findByEmailEager(email);
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email.toLowerCase())
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé avec email : " + email));

        if (!user.isEnabled() || user.getStatus() != UserStatus.ACTIVE) {
            throw new UsernameNotFoundException("Utilisateur désactivé ou banni");
        }

        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .roles(user.getRole().name())
                .build();
    }

    public User updateUser(UUID id, User updatedUser) {
        return userRepository.findById(id)
                .map(user -> {
                    user.setFirstName(updatedUser.getFirstName());
                    user.setLastName(updatedUser.getLastName());
                    user.setAge(updatedUser.getAge());
                    return userRepository.save(user);
                })
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Transactional
    public boolean deleteUserById(UUID userId) {
        tokenRepository.deleteByUser_IdAndType(userId, TokenType.REFRESH);
        tokenRepository.deleteByUser_IdAndType(userId, TokenType.VERIFICATION);
        tokenRepository.deleteByUser_IdAndType(userId, TokenType.PASSWORD_RESET);

        if (userRepository.existsById(userId)) {
            userRepository.deleteById(userId);
            return true;
        }
        return false;
    }

    public boolean deleteMyAccount(String email) {
        Optional<User> userOpt = userRepository.findByEmailAndDeletedAtIsNull(email);
        if (userOpt.isEmpty()) {
            return false;
        }

        User user = userOpt.get();
        user.setDeletedAt(LocalDateTime.now());
        user.setStatus(UserStatus.DELETED);
        user.setEnabled(false); 
        userRepository.save(user);
        return true;
    }

}
