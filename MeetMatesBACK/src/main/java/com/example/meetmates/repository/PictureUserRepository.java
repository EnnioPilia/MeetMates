package com.example.meetmates.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.meetmates.model.PictureUser;
import com.example.meetmates.model.User;

/**
 * Repository dédié à la gestion des entités {@link PictureUser}.
 *
 * Fournit les opérations CRUD standard via {@link JpaRepository},
 * ainsi qu'une méthode permettant de récupérer l’image associée à un utilisateur.
 *
 * Ce repository permet notamment de gérer la photo principale d'un utilisateur
 * et son lien direct avec l’entité User.
 *
 * L’implémentation est automatiquement assurée par Spring Data JPA.
 */
public interface PictureUserRepository extends JpaRepository<PictureUser, java.util.UUID> {

    /**
     * Recherche la photo associée à un utilisateur donné.
     *
     * @param user l'utilisateur dont on souhaite récupérer l'image
     * @return un Optional contenant la photo si elle existe
     */
    Optional<PictureUser> findByUser(User user);
}
