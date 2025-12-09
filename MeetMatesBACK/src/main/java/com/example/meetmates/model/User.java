package com.example.meetmates.model;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.type.SqlTypes;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

/**
 * Entité représentant un utilisateur de l’application MeetMates.
 *
 * Cette entité stocke :
 * - les informations personnelles (nom, email, âge, ville…)
 * - les informations d’authentification (mot de passe, statut activé)
 * - les rôles et statuts du compte
 * - les dates clés (création, mise à jour, suppression)
 *
 * Relations principales :
 * - One-To-One avec PictureUser : image principale du profil
 * - One-To-Many avec Token : liste des tokens d’authentification
 * - One-To-Many avec EventUser : événements auxquels l’utilisateur participe
 */
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Entity
@Table(name = "users")
public class User {

    /**
     * Identifiant UUID unique de l’utilisateur.
     * Généré automatiquement par Hibernate via un générateur UUID.
     * et stocké en tant que chaîne de caractères (CHAR 36).
     */
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @JdbcTypeCode(SqlTypes.CHAR)
    @Column(name = "user_id", length = 36, unique = true, nullable = false)
    private UUID id;

    /**
     * Prénom de l’utilisateur.
     */
    @Column(name = "first_name", nullable = false)
    private String firstName;

    /**
     * Nom de famille de l’utilisateur.
     */
    @Column(name = "last_name", nullable = false)
    private String lastName;

    /**
     * Adresse email unique utilisée pour l’authentification.
     */
    @Column(unique = true, nullable = false)
    private String email;

    /**
     * Mot de passe hashé.
     * Masqué dans les réponses JSON pour plus de sécurité.
     */
    @JsonIgnore
    @Column(nullable = false)
    private String password;

    /**
     * Âge de l’utilisateur (optionnel).
     */
    private Integer age;

    /**
     * Ville associée au profil utilisateur.
     */
    private String city;

    /**
     * Indique si le compte est activé (email vérifié).
     */
    @Column(nullable = false)
    private boolean enabled = false;

    /**
     * Statut du compte utilisateur (ACTIVE, SUSPENDED, etc.).
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserStatus status = UserStatus.ACTIVE;

    /**
     * Rôle attribué à l’utilisateur (USER, ADMIN…).
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role = UserRole.USER;

    /**
     * Date d’acceptation des CGU.
     */
    @Column(name = "accepted_cgu_at")
    private LocalDateTime acceptedCguAt;

    /**
     * Date de création du compte utilisateur.
     */
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    /**
     * Date de dernière mise à jour (automatique via Hibernate).
     */
    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    /**
     * Date de suppression logique du compte.
     * Permet de gérer le soft delete.
     */
    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    /**
     * Relation One-To-One : une seule photo principale par utilisateur.
     * La suppression de l'utilisateur entraîne la suppression de l’image.
     */
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private PictureUser pictureUser;

    /**
     * Relation One-To-Many : un utilisateur peut posséder plusieurs tokens (vérification, reset…).
     * orphanRemoval = true assure la suppression automatique des tokens liés.
     */
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Token> tokens;

    /**
     * Relation One-To-Many : liste des participations de l'utilisateur à des événements.
     */
    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<EventUser> eventUsers;

    /**
     * URL de la photo de profil (donnée simplifiée pour affichage rapide).
     */
    @Column(name = "profile_picture_url")
    private String profilePictureUrl;


    // --- GETTERS & SETTERS ---
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email.toLowerCase(); }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }

    public LocalDateTime getDeletedAt() { return deletedAt; }
    public void setDeletedAt(LocalDateTime deletedAt) { this.deletedAt = deletedAt; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public boolean isEnabled() { return enabled; }
    public void setEnabled(boolean enabled) { this.enabled = enabled; }

    public UserStatus getStatus() { return status; }
    public void setStatus(UserStatus status) { this.status = status; }

    public UserRole getRole() { return role; }
    public void setRole(UserRole role) { this.role = role; }

    public LocalDateTime getAcceptedCguAt() { return acceptedCguAt; }
    public void setAcceptedCguAt(LocalDateTime acceptedCguAt) { this.acceptedCguAt = acceptedCguAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public List<Token> getTokens() { return tokens; }
    public void setTokens(List<Token> tokens) { this.tokens = tokens; }

    public List<EventUser> getEventUsers() { return eventUsers; }
    public void setEventUsers(List<EventUser> eventUsers) { this.eventUsers = eventUsers; }

    public PictureUser getPictureUser() { return pictureUser; }
    public void setPictureUser(PictureUser pictureUser) { this.pictureUser = pictureUser; }

    public String getProfilePictureUrl() { return profilePictureUrl; }
    public void setProfilePictureUrl(String profilePictureUrl) { this.profilePictureUrl = profilePictureUrl; }

    public String getUsername() { return this.email; }
}
