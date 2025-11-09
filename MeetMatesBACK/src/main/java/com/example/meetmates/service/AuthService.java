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
import com.example.meetmates.dto.LoginRequest;
import com.example.meetmates.dto.LoginResponse;
import com.example.meetmates.dto.RegisterRequest;
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
    private VerificationTokenService VerificationTokenService;
    @Autowired
    private RefreshTokenService refreshTokenService;

    public String register(RegisterRequest request) {
        String email = request.getEmail().toLowerCase();

        Optional<User> existingUserOpt = userRepository.findByEmail(email);

        if (existingUserOpt.isPresent()) {
            User existingUser = existingUserOpt.get();

            if (existingUser.getDeletedAt() == null) {
                throw new RuntimeException("Email déjà utilisé");
            }

            existingUser.setFirstName(request.getFirstName());
            existingUser.setLastName(request.getLastName());
            existingUser.setPassword(passwordEncoder.encode(request.getPassword()));
            existingUser.setAge(request.getAge());
            existingUser.setRole(
                    request.getRole() == null
                    ? UserRole.USER
                    : UserRole.valueOf(request.getRole().toUpperCase())
            );
            existingUser.setEnabled(false);
            existingUser.setStatus(UserStatus.ACTIVE);
            existingUser.setAcceptedCguAt(request.getDateAcceptationCGU());
            existingUser.setDeletedAt(null); 

            userRepository.save(existingUser);

            String verificationToken = VerificationTokenService.createVerificationToken(existingUser);
            emailService.sendVerificationEmail(existingUser.getEmail(), verificationToken);

            return "Compte restauré avec succès, veuillez vérifier votre email.";
        }

        User newUser = new User();
        newUser.setFirstName(request.getFirstName());
        newUser.setLastName(request.getLastName());
        newUser.setEmail(email);
        newUser.setPassword(passwordEncoder.encode(request.getPassword()));
        newUser.setAge(request.getAge());
        newUser.setRole(
                request.getRole() == null
                ? UserRole.USER
                : UserRole.valueOf(request.getRole().toUpperCase())
        );
        newUser.setEnabled(false);
        newUser.setAcceptedCguAt(request.getDateAcceptationCGU());

        User savedUser = userRepository.save(newUser);

        String verificationToken = VerificationTokenService.createVerificationToken(savedUser);
        emailService.sendVerificationEmail(savedUser.getEmail(), verificationToken);

        return "Utilisateur enregistré avec succès, veuillez vérifier votre email.";
    }

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

        if (!user.isEnabled()) {
            throw new RuntimeException("Compte non vérifié");
        }

        String role = user.getRole().name().toLowerCase();
        String token = jwtUtils.generateToken(user.getEmail(), role);
        Token refreshToken = refreshTokenService.createRefreshToken(user);

        ResponseCookie authCookie = ResponseCookie.from("authToken", token)
                .httpOnly(true)
                .secure(false) // mettre true en prod avec HTTPS
                .path("/")
                .maxAge(jwtUtils.getJwtExpirationMs() / 1000)
                .sameSite("Strict")
                .build();

        ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", refreshToken.getToken())
                .httpOnly(true)
                .secure(false) // mettre true en prod avec HTTPS
                .path("/")
                .maxAge(7 * 24 * 60 * 60)
                .sameSite("Strict")
                .build();

        response.addHeader("Set-Cookie", authCookie.toString());
        response.addHeader("Set-Cookie", refreshCookie.toString());

        return new LoginResponse("Connexion réussie !", token);
    }

    public String verifyUser(String token) {
        boolean verified = VerificationTokenService.confirmToken(token);
        if (verified) {
            return "Compte vérifié avec succès !";
        } else {
            throw new RuntimeException("Token invalide ou expiré");
        }
    }

    public void logout(HttpServletResponse response) {
        ResponseCookie authCookie = ResponseCookie.from("authToken", "")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(0)
                .sameSite("Strict")
                .build();

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
