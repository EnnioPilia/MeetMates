package com.example.meetmates.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.meetmates.model.core.User;
import com.example.meetmates.model.core.UserStatus;
import com.example.meetmates.model.security.TokenType;
import com.example.meetmates.repository.TokenRepository;
import com.example.meetmates.repository.UserRepository;

@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final TokenRepository tokenRepository;

    @Autowired
    public UserService(UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            TokenRepository tokenRepository) {
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

    // =================== Security / UserDetails ===================
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email.toLowerCase())
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé avec email : " + email));

        if (!user.isEnabled() || user.getStatus() != UserStatus.ACTIVE) {
            throw new UsernameNotFoundException("Utilisateur désactivé ou banni");
        }

        // ✅ On convertit l’enum UserRole en String pour Spring Security
        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .roles(user.getRole().name()) // <-- ICI : on met .name()
                .build();
    }

    public User updateUser(UUID id, User updatedUser) {
        return userRepository.findById(id)
                .map(user -> {
                    user.setFirstName(updatedUser.getFirstName());
                    user.setLastName(updatedUser.getLastName());
                    user.setEmail(updatedUser.getEmail());
                    user.setAge(updatedUser.getAge());
                    return userRepository.save(user);
                })
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
    // =================== Suppression Utilisateur ===================
    @Transactional
    public boolean deleteUserById(UUID userId) {
        // Supprimer les tokens liés à l'utilisateur
        tokenRepository.deleteByUser_IdAndType(userId, TokenType.REFRESH);
        tokenRepository.deleteByUser_IdAndType(userId, TokenType.VERIFICATION);
        tokenRepository.deleteByUser_IdAndType(userId, TokenType.PASSWORD_RESET);

        if (userRepository.existsById(userId)) {
            userRepository.deleteById(userId);
            return true;
        }
        return false;
    }

    @Transactional
    public boolean deleteMyAccount(Authentication authentication) {
        String email = authentication.getName();

        return userRepository.findByEmail(email).map(user -> {
            userRepository.delete(user); // Hard delete
            return true;
        }).orElse(false);
    }

}
