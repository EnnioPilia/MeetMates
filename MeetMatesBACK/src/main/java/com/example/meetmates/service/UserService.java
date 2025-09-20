package com.example.meetmates.service;

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
import com.example.meetmates.repository.TokenRepository;
import com.example.meetmates.repository.UserRepository;

@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenRepository tokenRepository;

    @Autowired
    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       TokenRepository tokenRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenRepository = tokenRepository;
    }

    // =================== CRUD Utilisateur ===================

    public User updateUser(User user) {
        return userRepository.save(user);
    }

    public User register(User user) {
        if (userRepository.findByEmail(user.getEmail().toLowerCase()).isPresent()) {
            throw new RuntimeException("Email déjà utilisé");
        }
        user.setEmail(user.getEmail().toLowerCase());
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setActif(false);
        user.setRole(user.getRole() == null ? "USER" : user.getRole().toUpperCase());
        return userRepository.save(user);
    }

    public User createUser(User user) {
        user.setEmail(user.getEmail().toLowerCase());
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole("USER");
        user.setActif(true);
        return userRepository.save(user);
    }

    public User registerAdmin(User user) {
        user.setEmail(user.getEmail().toLowerCase());
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole("ADMIN");
        user.setActif(true);
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

    // =================== Security / UserDetails ===================

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email.toLowerCase())
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé avec email : " + email));

        if (!user.isActif()) {
            throw new UsernameNotFoundException("Utilisateur non actif");
        }

        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .roles(user.getRole())
                .build();
    }

    // =================== Suppression Utilisateur ===================

@Transactional
public boolean deleteUserById(UUID userId) {
    // Supprimer les refresh tokens liés à l'utilisateur
    tokenRepository.deleteByUser_IdAndType(userId, TokenType.REFRESH);

    // Supprimer les tokens de vérification
    tokenRepository.deleteByUser_IdAndType(userId, TokenType.VERIFICATION);

    // Supprimer les tokens de reset
    tokenRepository.deleteByUser_IdAndType(userId, TokenType.PASSWORD_RESET);

    if (userRepository.existsById(userId)) {
        userRepository.deleteById(userId);
        return true;
    }
    return false;
}

}
