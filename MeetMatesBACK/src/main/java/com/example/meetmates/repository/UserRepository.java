package com.example.meetmates.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.meetmates.model.User;

/**
 * Repository gérant les opérations de persistance liées aux entités {@link User}.
 *
 * Fournit des méthodes de recherche d’utilisateur via l’email, en tenant compte
 * ou non des enregistrements marqués comme supprimés. Les opérations CRUD
 * classiques sont automatiquement prises en charge par {@link JpaRepository}.
 */
public interface UserRepository extends JpaRepository<User, UUID> {

    /**
     * Recherche un utilisateur par son adresse email.
     *
     * @param email adresse email de l'utilisateur
     * @return un Optional contenant l'utilisateur s'il existe
     */
    Optional<User> findByEmail(String email);

    /**
     * Recherche un utilisateur par son adresse email
     * sans filtrage automatique des relations (chargement explicite dans la requête).
     *
     * @param email adresse email recherchée
     * @return un Optional contenant l'utilisateur correspondant
     */
    @Query("SELECT u FROM User u WHERE u.email = :email")
    Optional<User> findByEmailEager(@Param("email") String email);

    /**
     * Vérifie si un utilisateur actif (non supprimé) existe pour une adresse email donnée.
     *
     * @param email adresse email à vérifier
     * @return true si un utilisateur actif existe, false sinon
     */
    boolean existsByEmailAndDeletedAtIsNull(String email);

    /**
     * Recherche un utilisateur actif (non supprimé) par adresse email.
     *
     * @param email adresse email de l'utilisateur
     * @return un Optional contenant l'utilisateur actif s'il existe
     */
    Optional<User> findByEmailAndDeletedAtIsNull(String email);

    /**
     * Recherche un utilisateur par email, incluant ceux marqués comme supprimés.
     *
     * @param email adresse email recherchée
     * @return un Optional contenant l'utilisateur correspondant, qu’il soit actif ou supprimé
     */
    @Query("SELECT u FROM User u WHERE u.email = :email")
    Optional<User> findByEmailIncludingDeleted(String email);
}
