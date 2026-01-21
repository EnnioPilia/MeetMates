package com.example.meetmates.security;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.example.meetmates.user.service.UserService;

import lombok.extern.slf4j.Slf4j;

/**
 * Configuration centrale de la sécurité de l'application.
 *
 * Cette classe configure :
 * - Les filtres JWT
 * - Les règles d'accès (routes publiques / protégées)
 * - Le CORS
 * - Les gestionnaires d’exception (401 / 403)
 * - Le mode Stateless pour une API REST
 */
@Slf4j
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    /**
     * Constructeur injectant le filtre JWT chargé d'extraire et valider
     * les tokens présents dans les en-têtes HTTP.
     *
     * @param jwtAuthenticationFilter filtre d'authentification JWT
     */
    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    // * Liste des routes publiques accessibles sans authentification
    private static final List<String> PUBLIC_URLS = List.of(
            "/auth/login",
            "/auth/register",
            "/auth/verify",
            "/auth/logout",
            "/auth/request-reset",
            "/auth/reset-password",
            "/auth/refresh-token",
            "/category",
            "/activity",
            "/activity/**",
            "/event",
            "/event/**",
            "/error/**"
    );

    // * Déclaration des rôles utilisés dans la sécurité
    private static final String ROLE_USER = "USER";
    private static final String ROLE_ADMIN = "ADMIN";

    /**
     * URL du frontend autorisée pour le CORS.
     * La valeur est injectée depuis les fichiers de configuration (application.properties).
     */    
    @Value("${app.frontend.url}")
    private String frontendUrl;

    @Value("${app.frontend.prod.url}")
    private String frontendProdUrl;
    /**
     * Configuration CORS de l'application. Définit les origines, méthodes et headers autorisés.
     *
     * @return configuration CORS pour Spring Security
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of(frontendUrl, frontendProdUrl));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    /**
     * Chaîne de filtres principale de Spring Security. Configure : -
     * Désactivation de CSRF - Activation du CORS - Gestion des routes publiques
     * et protégées - Gestion des erreurs 401 et 403 - Ajout du filtre JWT - Mode stateless (pas de session)
     *
     * @param http configuration HTTP
     * @param userService service utilisateur pour l’authentification
     * @return une SecurityFilterChain prête à l’emploi
     * @throws Exception en cas d’erreur de configuration
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, UserService userService) throws Exception {
        log.info("SecurityFilterChain initialisée, routes publiques : {}", PUBLIC_URLS);
            http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers(PUBLIC_URLS.toArray(String[]::new)).permitAll()
                .requestMatchers("/admin/**", "/admin/dashboard/**").hasRole(ROLE_ADMIN)
                .requestMatchers(HttpMethod.DELETE, "/event/**").hasRole(ROLE_ADMIN)
                .requestMatchers("/user/me", "/user/me/picture").hasAnyRole(ROLE_USER, ROLE_ADMIN)
                .requestMatchers("/user/**").hasRole(ROLE_ADMIN)
                .anyRequest().authenticated()
                )
                .exceptionHandling(ex -> ex
                .authenticationEntryPoint((req, res, authException) -> {
                    res.setStatus(HttpStatus.UNAUTHORIZED.value());
                    res.setContentType("application/json; charset=UTF-8");
                    res.getWriter().write("""
                            {
                                "message": "Vous devez être connecté pour accéder à cette ressource."
                            }
                            """);
                })
                .accessDeniedHandler((req, res, accessDeniedException) -> {
                    res.setStatus(HttpStatus.FORBIDDEN.value());
                    res.setContentType("application/json; charset=UTF-8");
                    res.getWriter().write("""
                            {
                                "message": "Vous n’avez pas la permission d’accéder à cette ressource."
                            }
                            """);
                })
                )
                .authenticationProvider(authenticationProvider(userService))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * Provider d’authentification basé sur : 
     * - UserService (chargement utilisateur) 
     * - BCrypt pour encoder les mots de passe
     *
     * @param userService service de gestion des utilisateurs
     * @return un AuthenticationProvider configuré
     */
    @Bean
    public AuthenticationProvider authenticationProvider(UserService userService) {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    /**
     * Encoder BCrypt utilisé pour hasher les mots de passe
     *
     * @return encodeur de mots de passe BCrypt
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Fournit l’AuthenticationManager utilisé par Spring Security. Il s’appuie
     * automatiquement sur les AuthenticationProvider déclarés.
     *
     * @param config configuration Spring Security
     * @return AuthenticationManager prêt à l’emploi
     * @throws Exception si la récupération échoue
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
