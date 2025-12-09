package com.example.meetmates.service;

import java.util.Optional;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.meetmates.dto.LoginRequestDto;
import com.example.meetmates.dto.LoginResponseDto;
import com.example.meetmates.dto.RegisterRequestDto;
import com.example.meetmates.exception.ApiException;
import com.example.meetmates.exception.ErrorCode;
import com.example.meetmates.model.Token;
import com.example.meetmates.model.User;
import com.example.meetmates.model.UserRole;
import com.example.meetmates.model.UserStatus;
import com.example.meetmates.repository.UserRepository;
import com.example.meetmates.security.JWTUtils;

import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

/**
 * Service gérant les actions d'authentification et de gestion des utilisateurs.
 * Il centralise la logique suivante : - Inscription et restauration de comptes
 * supprimés - Authentification et génération de tokens JWT - Vérification
 * d'email - Gestion des cookies d'authentification - Déconnexion Ce service
 * applique les règles métier concernant le statut des utilisateurs, la
 * vérification des comptes, et la gestion des tokens d'accès et de refresh.
 */
@Slf4j
@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JWTUtils jwtUtils;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;
    private final VerificationService verificationService;
    private final RefreshTokenService refreshTokenService;
    private final CookieService cookieService;

    /**
     * Constructeur du service d'authentification.
     *
     * @param userRepository repository utilisateur
     * @param passwordEncoder encodeur de mot de passe
     * @param jwtUtils utilitaire pour générer et valider les JWT
     * @param authenticationManager manager Spring Security pour
     * l'authentification
     * @param emailService service pour l'envoi d'e-mails
     * @param verificationService service pour gérer les tokens de vérification
     * @param refreshTokenService service pour gérer les refresh tokens
     * @param cookieService service pour gérer les cookies d'authentification
     */
    public AuthService(UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JWTUtils jwtUtils,
            AuthenticationManager authenticationManager,
            EmailService emailService,
            VerificationService verificationService,
            RefreshTokenService refreshTokenService,
            CookieService cookieService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
        this.authenticationManager = authenticationManager;
        this.emailService = emailService;
        this.verificationService = verificationService;
        this.refreshTokenService = refreshTokenService;
        this.cookieService = cookieService;
    }

    /**
     * Enregistre un nouvel utilisateur ou restaure un compte supprimé. Vérifie
     * que l'utilisateur n'est pas banni et que l'e-mail n'est pas déjà utilisé.
     * Si l'inscription ou la restauration réussit, un e-mail de vérification
     * est envoyé.
     *
     * @param request DTO contenant les informations d'inscription
     * @return clé de message de succès
     * @throws ApiException si l'utilisateur est banni ou si l'e-mail est déjà
     * utilisé
     */
    @Transactional
    public String register(RegisterRequestDto request) {
        String email = request.getEmail().toLowerCase();
        Optional<User> existingUserOpt = userRepository.findByEmail(email);
        log.info("Tentative d'inscription pour l'email {}", email);

        if (existingUserOpt.isPresent()) {
            User user = existingUserOpt.get();

            if (user.getStatus() == UserStatus.BANNED) {
                log.warn("Inscription refusée : utilisateur banni {}", email);
                throw new ApiException(ErrorCode.USER_BANNED);
            }

            if (user.getDeletedAt() == null) {
                log.warn("Inscription refusée : email déjà utilisé {}", email);
                throw new ApiException(ErrorCode.USER_EMAIL_USED);
            }

            log.info("Création d'un nouvel utilisateur {}", email);

            user.setFirstName(request.getFirstName());
            user.setLastName(request.getLastName());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setAge(request.getAge());
            user.setRole(UserRole.USER);
            user.setEnabled(false);
            user.setStatus(UserStatus.ACTIVE);
            user.setAcceptedCguAt(request.getDateAcceptationCGU());
            user.setDeletedAt(null);
            user.setTokens(null);

            userRepository.save(user);

            String token = verificationService.createVerificationToken(user);
            emailService.sendVerificationEmail(user.getEmail(), token);

            return "AUTH.REGISTER.SUCCESS";
        }

        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setAge(request.getAge());
        user.setRole(UserRole.USER);
        user.setEnabled(false);
        user.setAcceptedCguAt(request.getDateAcceptationCGU());

        userRepository.save(user);

        String token = verificationService.createVerificationToken(user);
        emailService.sendVerificationEmail(user.getEmail(), token);

        return "AUTH.REGISTER.SUCCESS";
    }

    /**
     * Authentifie un utilisateur et positionne les cookies d'accès et refresh
     * token.
     *
     * @param request DTO contenant l'e-mail et le mot de passe
     * @param response réponse HTTP pour ajouter les cookies
     * @return DTO contenant le token d'accès
     * @throws ApiException si l'utilisateur est introuvable, banni, supprimé ou
     * non activé
     */
    @Transactional
    public LoginResponseDto login(LoginRequestDto request, HttpServletResponse response) {
        String email = request.getEmail().toLowerCase();
        log.info("Tentative de connexion pour {}", email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> {
                    log.warn("Connexion échouée : utilisateur non trouvé {}", email);
                    return new ApiException(ErrorCode.USER_NOT_FOUND);
                });

        if (user.getStatus() == UserStatus.BANNED) {
            log.warn("Connexion échouée : utilisateur banni {}", email);
            throw new ApiException(ErrorCode.USER_BANNED);
        }
        if (user.getDeletedAt() != null) {
            log.warn("Connexion échouée : compte supprimé {}", email);
            throw new ApiException(ErrorCode.USER_DELETED);
        }
        if (!user.isEnabled()) {
            log.warn("Connexion échouée : compte désactivé {}", email);
            throw new ApiException(ErrorCode.USER_DISABLED);
        }

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, request.getPassword()));
        } catch (org.springframework.security.authentication.BadCredentialsException ex) {
            log.warn("Connexion échouée : mauvais mot de passe pour {}", email);
            throw new ApiException(ErrorCode.AUTH_BAD_PASSWORD);
        }

        log.info("Connexion réussie pour {}", email);

        String role = user.getRole().name().toLowerCase();
        String jwt = jwtUtils.generateAccessToken(user.getEmail(), role);
        Token refreshToken = refreshTokenService.createRefreshToken(user);

        cookieService.setAuthCookies(
                response,
                jwt,
                refreshToken.getToken(),
                jwtUtils.getJwtExpirationMs() / 1000,
                7 * 24 * 60 * 60
        );

        return new LoginResponseDto(jwt);
    }

    /**
     * Vérifie le token de confirmation d'inscription et active le compte.
     *
     * @param token token de vérification
     * @return clé de message de succès
     */
    @Transactional
    public String verifyUser(String token) {
        log.info("Vérification du token {}", token);
        verificationService.confirmToken(token);

        log.info("Compte vérifié avec succès");
        return "AUTH.VERIFY.SUCCESS";
    }

    /**
     * Déconnecte l'utilisateur et supprime les cookies d'authentification.
     *
     * @param response réponse HTTP pour supprimer les cookies
     * @return clé de message de succès
     */
    public String logout(HttpServletResponse response) {
        log.info("Déconnexion utilisateur");
        cookieService.clearAuthCookies(response);
        
        return "AUTH.LOGOUT.SUCCESS";
    }
}
