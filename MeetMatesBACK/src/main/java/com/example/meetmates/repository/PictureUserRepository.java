package com.example.meetmates.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.meetmates.model.PictureUser;
import com.example.meetmates.model.User;

/**
 * Repository dédié à la gestion des entités {@link PictureUser}.
 *
 * Cette interface fournit les opérations CRUD standard via
 * {@link JpaRepository}, ainsi que des méthodes spécifiques permettant de gérer
 * les photos de profil des utilisateurs.
 *
 * Elle permet notamment : - de récupérer l’historique complet des photos d’un
 * utilisateur, - d’identifier la photo principale actuellement active (main =
 * true).
 *
 * Les photos supprimées logiquement (soft delete) sont automatiquement exclues
 * des résultats grâce à l’annotation {@code @Where} définie sur l’entité
 * {@link PictureUser}.
 *
 * L’implémentation est automatiquement fournie par Spring Data JPA.
 */
public interface PictureUserRepository extends JpaRepository<PictureUser, UUID> {

    /**
     * Récupère l’ensemble des photos associées à un utilisateur donné.
     *
     * Cette méthode retourne l’historique des photos de profil encore actives
     * (non supprimées logiquement).
     *
     * @param user l’utilisateur concerné
     * @return la liste des photos de profil de l’utilisateur
     */
    List<PictureUser> findAllByUser(User user);

    /**
     * Récupère la photo principale actuellement active d’un utilisateur.
     *
     * Une seule photo doit être marquée comme principale (main = true) à un
     * instant donné.
     *
     * @param user l’utilisateur concerné
     * @return un Optional contenant la photo principale si elle existe
     */
    Optional<PictureUser> findByUserAndMainTrue(User user);
}
