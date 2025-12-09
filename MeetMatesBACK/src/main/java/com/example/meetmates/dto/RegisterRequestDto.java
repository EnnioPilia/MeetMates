package com.example.meetmates.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/**
 * DTO utilisé lors de l'inscription d'un utilisateur.
 *
 * Ce modèle permet de valider et transporter les informations nécessaires
 * à la création d'un nouveau compte utilisateur dans l'application.
 */
public class RegisterRequestDto {

    /** Prénom de l'utilisateur. Doit être renseigné. */
    @NotBlank(message = "Le prénom est obligatoire.")
    private String firstName;

    /** Nom de famille de l'utilisateur. Doit être renseigné. */
    @NotBlank(message = "Le nom est obligatoire.")
    private String lastName;

    /** Adresse email de l'utilisateur. Doit être valide et non vide. */
    @Email(message = "Email invalide.")
    @NotBlank(message = "L'email est obligatoire.")
    private String email;

    /**
     * Mot de passe choisi par l'utilisateur.
     * Doit contenir au minimum 6 caractères,
     * une majuscule, une minuscule, un chiffre et un caractère spécial.
     */
    @NotBlank(message = "Le mot de passe est obligatoire.")
    @Size(min = 6, message = "Le mot de passe doit contenir au moins 6 caractères.")
    @Pattern(
        regexp = "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*?&]).{6,}$",
        message = "Le mot de passe doit contenir une majuscule, une minuscule, un chiffre et un caractère spécial."
    )
    private String password;

    /** Âge de l'utilisateur (optionnel). */
    private Integer age;

    /** Rôle attribué à l'utilisateur lors de la création du compte (ex. : USER, ADMIN). */
    private String role;

    /**
     * Date et heure de l'acceptation des CGU.
     * Stockée pour conformité légale ou suivi utilisateur.
     */
    private LocalDateTime dateAcceptationCGU;


    // --- GETTERS & SETTERS ---

    /** @return prénom de l'utilisateur */
    public String getFirstName() { return firstName; }

    /** @param firstName prénom de l'utilisateur */
    public void setFirstName(String firstName) { this.firstName = firstName; }

    /** @return nom de l'utilisateur */
    public String getLastName() { return lastName; }

    /** @param lastName nom de l'utilisateur */
    public void setLastName(String lastName) { this.lastName = lastName; }

    /** @return email de l'utilisateur */
    public String getEmail() { return email; }

    /** @param email adresse email valide de l'utilisateur */
    public void setEmail(String email) { this.email = email; }

    /** @return mot de passe */
    public String getPassword() { return password; }

    /** @param password mot de passe conforme aux règles de validation */
    public void setPassword(String password) { this.password = password; }

    /** @return âge de l'utilisateur */
    public Integer getAge() { return age; }

    /** @param age âge de l'utilisateur */
    public void setAge(Integer age) { this.age = age; }

    /** @return rôle de l'utilisateur */
    public String getRole() { return role; }

    /** @param role rôle attribué à l'utilisateur */
    public void setRole(String role) { this.role = role; }

    /** @return date d'acceptation des CGU */
    public LocalDateTime getDateAcceptationCGU() { return dateAcceptationCGU; }

    /** @param dateAcceptationCGU date et heure d'acceptation des CGU */
    public void setDateAcceptationCGU(LocalDateTime dateAcceptationCGU) {
        this.dateAcceptationCGU = dateAcceptationCGU;
    }
}
