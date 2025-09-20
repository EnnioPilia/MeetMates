package com.example.meetmates.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.meetmates.config.JWTUtils;
import com.example.meetmates.dto.LoginRequest;
import com.example.meetmates.dto.LoginResponse;
import com.example.meetmates.dto.RegisterRequest;
import com.example.meetmates.model.Token;
import com.example.meetmates.model.User;
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
    private VerificationTokenService VerificationTokenService;

    @Autowired
    private RefreshTokenService refreshTokenService;

    // ========================= Enregistrement =========================
    public String register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail().toLowerCase()).isPresent()) {
            throw new RuntimeException("Email déjà utilisé");
        }

        User user = new User();

        if (request.getName() != null && !request.getName().isBlank()) {
            String[] parts = request.getName().trim().split(" ", 2);
            user.setNom(parts[0]);
            user.setPrenom(parts.length > 1 ? parts[1] : "");
        } else {
            user.setNom("");
            user.setPrenom("");
        }

        user.setEmail(request.getEmail().toLowerCase());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setAge(request.getAge());
        user.setRole(request.getRole() == null ? "USER" : request.getRole().toUpperCase());
        user.setActif(false);

        User savedUser = userRepository.save(user);

        // Créer et envoyer le token de vérification
        String verificationToken = VerificationTokenService.createVerificationToken(savedUser);
        emailService.sendVerificationEmail(savedUser.getEmail(), verificationToken);

        return "Utilisateur enregistré avec succès, veuillez vérifier votre email";
    }

    // ========================= Login =========================
    public LoginResponse login(LoginRequest request, HttpServletResponse response) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail().toLowerCase(), 
                            request.getPassword()
                    )
            );
        } catch (BadCredentialsException e) {
            throw new BadCredentialsException("Identifiants invalides");
        }

        User user = userRepository.findByEmail(request.getEmail().toLowerCase())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        if (!user.isActif()) {
            throw new RuntimeException("Compte non vérifié");
        }

        String role = user.getRole().toLowerCase();

        // Générer JWT authToken
        String token = jwtUtils.generateToken(user.getEmail(), role);

        // Générer refreshToken
        Token refreshToken = refreshTokenService.createRefreshToken(user);

        // Cookie authToken
        ResponseCookie authCookie = ResponseCookie.from("authToken", token)
                .httpOnly(true)
                .secure(false) // mettre true en prod avec HTTPS
                .path("/")
                .maxAge(jwtUtils.getJwtExpirationMs() / 1000)
                .sameSite("Strict")
                .build();

        // Cookie refreshToken
        ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", refreshToken.getToken())
                .httpOnly(true)
                .secure(false) // mettre true en prod avec HTTPS
                .path("/")
                .maxAge(7 * 24 * 60 * 60) // 7 jours
                .sameSite("Strict")
                .build();

        response.addHeader("Set-Cookie", authCookie.toString());
        response.addHeader("Set-Cookie", refreshCookie.toString());

        return new LoginResponse("Connexion réussie !", token);
    }

    // ========================= Vérification utilisateur =========================
    public String verifyUser(String token) {
        boolean verified = VerificationTokenService.confirmToken(token);
        if (verified) {
            return "Compte vérifié avec succès !";
        } else {
            throw new RuntimeException("Token invalide ou expiré");
        }
    }

    // ========================= Logout =========================
    public void logout(HttpServletResponse response) {
        // Supprimer authToken
        ResponseCookie authCookie = ResponseCookie.from("authToken", "")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(0)
                .sameSite("Strict")
                .build();

        // Supprimer refreshToken
        ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(0)
                .sameSite("Strict")
                .build();

        response.addHeader("Set-Cookie", authCookie.toString());
        response.addHeader("Set-Cookie", refreshCookie.toString());
    }
}
