package com.example.meetmates.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.meetmates.config.JWTUtils;
import com.example.meetmates.dto.LoginRequestDto;
import com.example.meetmates.dto.LoginResponseDto;
import com.example.meetmates.dto.RegisterRequestDto;
import com.example.meetmates.exception.EmailAlreadyUsedException;
import com.example.meetmates.exception.InvalidTokenException;
import com.example.meetmates.exception.UserDisabledException;
import com.example.meetmates.exception.UserNotFoundException;
import com.example.meetmates.model.Token;
import com.example.meetmates.model.User;
import com.example.meetmates.model.UserRole;
import com.example.meetmates.model.UserStatus;
import com.example.meetmates.repository.UserRepository;

import jakarta.servlet.http.HttpServletResponse;

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
    private VerificationTokenService verificationTokenService;
    @Autowired
    private RefreshTokenService refreshTokenService;

    // ============================================================
    // REGISTER
    // ============================================================
    public String register(RegisterRequestDto request) {

        String email = request.getEmail().toLowerCase();

        Optional<User> existingUserOpt = userRepository.findByEmail(email);

        // ---- Cas 1 : l’email existe et n'est pas supprimé
        if (existingUserOpt.isPresent()) {
            User existingUser = existingUserOpt.get();

            if (existingUser.getDeletedAt() == null) {
                throw new EmailAlreadyUsedException("Email déjà utilisé.");
            }

            // ---- Cas 2 : l’utilisateur existait mais était supprimé → restauration
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

            userRepository.save(existingUser);

            String verificationToken = verificationTokenService.createVerificationToken(existingUser);
            emailService.sendVerificationEmail(existingUser.getEmail(), verificationToken);

            return "Compte restauré avec succès. Vérifiez votre email.";
        }

        // ---- Cas 3 : création d'un nouvel utilisateur
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

        String verificationToken = verificationTokenService.createVerificationToken(savedUser);
        emailService.sendVerificationEmail(savedUser.getEmail(), verificationToken);

        return "Utilisateur enregistré avec succès. Vérifiez votre email.";
    }

    // ============================================================
    // LOGIN
    // ============================================================
    public LoginResponseDto login(LoginRequestDto request, HttpServletResponse response) {

        String email = request.getEmail().toLowerCase();

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, request.getPassword()));
        } catch (BadCredentialsException e) {
            throw new BadCredentialsException("Identifiants invalides.");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("Utilisateur non trouvé."));

        if (!user.isEnabled()) {
            throw new UserDisabledException("Compte non vérifié.");
        }

        String role = user.getRole().name().toLowerCase();
        String jwt = jwtUtils.generateAccessToken(user.getEmail(), role);
        Token refreshToken = refreshTokenService.createRefreshToken(user);

       ResponseCookie authCookie = ResponseCookie.from("authToken", jwt)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .sameSite("None") // strict en prod
                .maxAge(jwtUtils.getJwtExpirationMs() / 1000)
                .build();

        ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", refreshToken.getToken())
                .httpOnly(true)
                .secure(true)
                .path("/")
                .sameSite("None") // strict en prod
                .maxAge(7 * 24 * 60 * 60)
                .build();


        response.addHeader("Set-Cookie", authCookie.toString());
        response.addHeader("Set-Cookie", refreshCookie.toString());

        return new LoginResponseDto("Connexion réussie !", jwt);
    }

    // ============================================================
    // VERIFY EMAIL
    // ============================================================
    public String verifyUser(String token) {
        try {
            boolean confirmed = verificationTokenService.confirmToken(token);
            if (!confirmed) {
                throw new InvalidTokenException("Token invalide ou expiré.");
            }
            return "Compte vérifié avec succès !";
        } catch (InvalidTokenException e) {
            throw e; 
        } catch (RuntimeException e) {
            throw new InvalidTokenException("Erreur lors de la vérification du token.");
        }
    }

    // ==================== ========================================
    // LOGOUT
    // ============================================================
    public void logout(HttpServletResponse response) {

        ResponseCookie authCookie = ResponseCookie.from("authToken", "")
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(0)
                .sameSite("None")
                .build();

        ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(0)
                .sameSite("None")
                .build();

        response.addHeader("Set-Cookie", authCookie.toString());
        response.addHeader("Set-Cookie", refreshCookie.toString());
    }
}
