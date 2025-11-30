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
     * Enregistre ou restaure un compte.
     * Retourne la clé de message (ex: "auth.register.success").
     */
    @Transactional
    public String register(RegisterRequestDto request) {
        String email = request.getEmail().toLowerCase();
        Optional<User> existingUserOpt = userRepository.findByEmail(email);

        if (existingUserOpt.isPresent()) {
            User user = existingUserOpt.get();

            if (user.getStatus() == UserStatus.BANNED) {
                throw new ApiException(ErrorCode.USER_BANNED);
            }

            if (user.getDeletedAt() == null) {
                // compte actif et email déjà utilisé
                throw new ApiException(ErrorCode.USER_EMAIL_USED);
            }

            // Restaurer compte supprimé
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

            return "auth.register.success";
        }

        // Nouveau compte
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

        return "auth.register.success";
    }

    /**
     * Authentifie et positionne les cookies. Retourne le DTO contenant l'access token.
     */
    @Transactional
    public LoginResponseDto login(LoginRequestDto request, HttpServletResponse response) {
        String email = request.getEmail().toLowerCase();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException(ErrorCode.USER_NOT_FOUND));

        if (user.getStatus() == UserStatus.BANNED) {
            throw new ApiException(ErrorCode.USER_BANNED);
        }
        if (user.getDeletedAt() != null) {
            throw new ApiException(ErrorCode.USER_DELETD);
        }
        if (!user.isEnabled()) {
            throw new ApiException(ErrorCode.USER_DISABLED);
        }

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, request.getPassword()));
        } catch (org.springframework.security.authentication.BadCredentialsException ex) {
            throw new ApiException(ErrorCode.AUTH_BAD_PASSWORD);
        }

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
     * Vérifie le token de confirmation et retourne la clé message.
     */
    @Transactional
    public String verifyUser(String token) {
        verificationService.confirmToken(token);
        return "auth.verify.success";
    }

    /**
     * Logout : supprime cookies et retourne la clé message.
     */
    public String logout(HttpServletResponse response) {
        cookieService.clearAuthCookies(response);
        return "auth.logout.success";
    }
}
