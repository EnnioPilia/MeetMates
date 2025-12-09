package com.example.meetmates.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.meetmates.model.EventUser;
import com.example.meetmates.model.EventUser.ParticipantRole;

/**
 * Repository dédié à la gestion des entités {@link EventUser}.
 *
 * Cette interface fournit les opérations CRUD standard via {@link JpaRepository},
 * ainsi que plusieurs méthodes permettant de rechercher ou vérifier la présence
 * d’un utilisateur dans un événement, déterminer son rôle ou son statut de participation.
 *
 * Elle facilite également l’extraction de listes de participants selon divers critères
 * comme l’événement, l’utilisateur, le rôle ou les statuts exclus.
 *
 * L’implémentation est automatiquement fournie par Spring Data JPA.
 */
public interface EventUserRepository extends JpaRepository<EventUser, UUID> {

    /**
     * Vérifie si un utilisateur est déjà lié à un événement.
     *
     * @param eventId l'identifiant de l'événement
     * @param userId l'identifiant de l'utilisateur
     * @return true si l'association existe, sinon false
     */
    boolean existsByEventIdAndUserId(UUID eventId, UUID userId);

    /**
     * Recherche l’association entre un événement et un utilisateur.
     *
     * @param eventId l'identifiant de l'événement
     * @param userId l'identifiant de l'utilisateur
     * @return un Optional contenant l’association si elle existe
     */
    Optional<EventUser> findByEventIdAndUserId(UUID eventId, UUID userId);

    /**
     * Recherche toutes les associations pour un utilisateur donné.
     *
     * @param userId l'identifiant de l'utilisateur
     * @return la liste de ses participations aux événements
     */
    List<EventUser> findAllByUserId(UUID userId);

    /**
     * Recherche toutes les associations pour un événement donné.
     *
     * @param eventId l'identifiant de l'événement
     * @return la liste des utilisateurs associés à cet événement
     */
    List<EventUser> findAllByEventId(UUID eventId);

    /**
     * Recherche les participations d’un utilisateur selon un rôle spécifique.
     *
     * @param userId l'identifiant de l'utilisateur
     * @param role le rôle du participant (organisateur ou participant)
     * @return la liste des participations correspondant au rôle
     */
    List<EventUser> findAllByUserIdAndRole(UUID userId, ParticipantRole role);

    /**
     * Recherche les participations d’un utilisateur en excluant certains statuts.
     *
     * @param userId l'identifiant de l'utilisateur
     * @param excludedStatuses les statuts à exclure
     * @return la liste correspondante des participations filtrées
     */
    List<EventUser> findAllByUserIdAndParticipationStatusNotIn(
            UUID userId,
            List<EventUser.ParticipationStatus> excludedStatuses
    );

    /**
     * Recherche les participations d’un utilisateur selon un rôle, et en excluant certains statuts.
     *
     * @param userId l'identifiant de l'utilisateur
     * @param role le rôle du participant
     * @param excludedStatuses les statuts à exclure
     * @return la liste des participations filtrées
     */
    List<EventUser> findAllByUserIdAndRoleAndParticipationStatusNotIn(
            UUID userId,
            ParticipantRole role,
            List<EventUser.ParticipationStatus> excludedStatuses
    );
}
