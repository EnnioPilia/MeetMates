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
import com.example.meetmates.exception.UserBannedException;
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
    public void register(RegisterRequestDto request) {

        String email = request.getEmail().toLowerCase();

        Optional<User> existingUserOpt = userRepository.findByEmail(email);

        if (existingUserOpt.isPresent()) {
            User user = existingUserOpt.get();

            if (user.getStatus() == UserStatus.BANNED) {
                throw new UserBannedException("Cet utilisateur est banni.");
            }

            if (user.getDeletedAt() == null) {
                throw new EmailAlreadyUsedException("Eeeeeeeeeemail déjà utilisé.");
            }

            // Restore compte supprimé
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

            return;
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
    }

    // LOGIN
    @Transactional
    public LoginResponseDto login(LoginRequestDto request, HttpServletResponse response) {

        String email = request.getEmail().toLowerCase();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("Uuuuuuuuuuuutilisateur non trouvé."));

        if (user.getStatus() == UserStatus.BANNED) {
            throw new UserBannedException("Uuuuuuuuuuuutilisateur banni.");
        }
        if (user.getDeletedAt() != null) {
            throw new UserDisabledException("Ccccccccccccccompte supprimé.");
        }

        if (!user.isEnabled()) {
            throw new UserDisabledException("Ccccccccccccompte non vérifié.");
        }

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, request.getPassword()));
        } catch (BadCredentialsException e) {
            throw new BadCredentialsException("Iiiiiiiiiiiiiidentifiants invalides.");
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

    // VERIFY EMAIL
    @Transactional
    public void verifyUser(String token) {
        verificationService.confirmToken(token);
    }

    // LOGOUT
    public void logout(HttpServletResponse response) {
        cookieService.clearAuthCookies(response);
    }
}
