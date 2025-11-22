package com.example.meetmates.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.meetmates.config.JWTUtils;
import com.example.meetmates.dto.LoginRequestDto;
import com.example.meetmates.dto.LoginResponseDto;
import com.example.meetmates.dto.RegisterRequestDto;
import com.example.meetmates.exception.EmailAlreadyUsedException;
import com.example.meetmates.exception.UserDisabledException;
import com.example.meetmates.exception.UserNotFoundException;
import com.example.meetmates.model.Token;
import com.example.meetmates.model.User;
import com.example.meetmates.model.UserRole;
import com.example.meetmates.model.UserStatus;
import com.example.meetmates.repository.UserRepository;

import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JWTUtils jwtUtils;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private EmailService emailService;
    @Autowired
    private VerificationService verificationService;
    @Autowired
    private RefreshTokenService refreshTokenService;
    @Autowired
    private CookieService cookieService;

    // REGISTER
    @Transactional
    public String register(RegisterRequestDto request) {

        String email = request.getEmail().toLowerCase();

        Optional<User> existingUserOpt = userRepository.findByEmail(email);

        if (existingUserOpt.isPresent()) {
            User existingUser = existingUserOpt.get();

            if (existingUser.getStatus() == UserStatus.BANNED) {
                throw new IllegalStateException("Cet utilisateur est banni et ne peut pas créer un nouveau compte.");
            }

            if (existingUser.getDeletedAt() == null) {
                throw new EmailAlreadyUsedException("Email déjà utilisé.");
            }

            existingUser.setFirstName(request.getFirstName());
            existingUser.setLastName(request.getLastName());
            existingUser.setPassword(passwordEncoder.encode(request.getPassword()));
            existingUser.setAge(request.getAge());
            existingUser.setRole(request.getRole() == null
                    ? UserRole.USER
                    : UserRole.valueOf(request.getRole().toUpperCase()));
            existingUser.setEnabled(false);
            existingUser.setStatus(UserStatus.ACTIVE);
            existingUser.setAcceptedCguAt(request.getDateAcceptationCGU());
            existingUser.setDeletedAt(null);
            existingUser.setDeletedAt(null);
            existingUser.setTokens(null);

            userRepository.save(existingUser);

            String verificationToken = verificationService.createVerificationToken(existingUser);
            emailService.sendVerificationEmail(existingUser.getEmail(), verificationToken);

            return "Compte restauré avec succès. Vérifiez votre email.";
        }

        User newUser = new User();
        newUser.setFirstName(request.getFirstName());
        newUser.setLastName(request.getLastName());
        newUser.setEmail(email);
        newUser.setPassword(passwordEncoder.encode(request.getPassword()));
        newUser.setAge(request.getAge());
        newUser.setRole(request.getRole() == null
                ? UserRole.USER
                : UserRole.valueOf(request.getRole().toUpperCase()));
        newUser.setEnabled(false);
        newUser.setAcceptedCguAt(request.getDateAcceptationCGU());

        User savedUser = userRepository.save(newUser);

        String verificationToken = verificationService.createVerificationToken(savedUser);
        emailService.sendVerificationEmail(savedUser.getEmail(), verificationToken);

        return "Utilisateur enregistré avec succès. Vérifiez votre email pour activer votre compte.";
    }

    // LOGIN
    @Transactional
    public LoginResponseDto login(LoginRequestDto request, HttpServletResponse response) {

        String email = request.getEmail().toLowerCase();

        log.info("[AUTH] Tentative de connexion pour {}", email);

        // Récupère l'utilisateur avant authentification
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("Utilisateur non trouvé."));

        if (user.getDeletedAt() != null) {
            log.warn("[AUTH] Connexion refusée pour {} : compte supprimé", email);
            throw new UserDisabledException("Compte supprimé.");
        }

        if (!user.isEnabled()) {
            log.warn("[AUTH] Connexion refusée pour {} : compte non vérifié", email);
            throw new UserDisabledException("Compte non vérifié.");
        }

        // Authentification
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, request.getPassword()));
        } catch (BadCredentialsException e) {
            log.warn("[AUTH] Échec de connexion pour {} : mauvais mot de passe", email);
            throw new BadCredentialsException("Identifiants invalides.");
        }

        // Génération du JWT
        String role = user.getRole().name().toLowerCase();
        String jwt = jwtUtils.generateAccessToken(user.getEmail(), role);
        Token refreshToken = refreshTokenService.createRefreshToken(user);

        // Cookies via CookieService
        cookieService.setAuthCookies(
                response,
                jwt,
                refreshToken.getToken(),
                jwtUtils.getJwtExpirationMs() / 1000,
                7 * 24 * 60 * 60
        );

        log.info("[AUTH] Connexion réussie pour {}", email);

        return new LoginResponseDto("Connexion réussie !", jwt);

    }

    // VERIFY EMAIL
    @Transactional
    public String verifyUser(String token) {
        verificationService.confirmToken(token);
        return "Compte vérifié avec succès !";
    }

    // LOGOUT
    public void logout(HttpServletResponse response) {
        cookieService.clearAuthCookies(response);
    }
}
