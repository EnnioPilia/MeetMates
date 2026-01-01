package com.example.meetmates.event.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.meetmates.activity.model.Activity;
import com.example.meetmates.event.model.Event;

/**
 * Repository pour la gestion des entités {@link Event}.
 *
 * Fournit les opérations CRUD standard via {@link JpaRepository}, ainsi que des
 * méthodes de recherche spécifiques basées sur différents critères tels que
 * l’activité, l’adresse, la date ou le statut d’un événement.
 *
 * Ce repository inclut également plusieurs requêtes personnalisées permettant
 * de charger un événement avec ses relations (activité, adresse, participants,
 * utilisateurs) pour éviter les problèmes de Lazy Loading.
 *
 * L’implémentation de ce repository est automatiquement assurée par Spring Data
 * JPA.
 */
@Repository
public interface EventRepository extends JpaRepository<Event, UUID> {

    List<Event> findAll(); // admin only

    /**
     * Recherche les événements associés à une activité donnée.
     *
     * @param activity l'activité liée aux événements recherchés
     * @return la liste des événements pour cette activité
     */
    List<Event> findByActivity(Activity activity);

    /**
     * Charge tous les événements liés à une activité spécifique en incluant
     * l'activité et l'adresse.
     *
     * @param activityId l'identifiant de l'activité
     * @return la liste d'événements enrichis
     */
    @Query("""
      SELECT DISTINCT e FROM Event e
      LEFT JOIN FETCH e.activity a
      LEFT JOIN FETCH e.address addr
      WHERE a.id = :activityId
        AND e.deletedAt IS NULL
    """)
    List<Event> findActiveByActivityIdWithDetails(UUID activityId);

    /**
     * Charge tous les événements avec leur activité et leur adresse.
     *
     * @return la liste complète des événements enrichis
     */
    @Query("""
      SELECT DISTINCT e
      FROM Event e
      LEFT JOIN FETCH e.participants
      LEFT JOIN FETCH e.activity
      LEFT JOIN FETCH e.address
      WHERE e.deletedAt IS NULL
      """)
    List<Event> findAllActiveWithDetails();

    /**
     * Charge un événement complet avec activité, adresse, participants et
     * utilisateurs associés.
     *
     * @param id l'identifiant de l'événement
     * @return un Optional contenant l'événement enrichi si trouvé
     */
    @Query("""
      SELECT DISTINCT e FROM Event e
      LEFT JOIN FETCH e.activity
      LEFT JOIN FETCH e.address
      LEFT JOIN FETCH e.participants eu
      LEFT JOIN FETCH eu.user
      WHERE e.id = :id
        AND e.deletedAt IS NULL
    """)
    Optional<Event> findByIdWithAllRelations(@Param("id") UUID id);

    /**
     * Recherche des événements en fonction d'un texte, en examinant le titre,
     * le nom de l'activité ou l'adresse associée.
     *
     * @param query la chaîne de recherche
     * @return la liste des événements correspondant au texte recherché
     */
    @Query("""
      SELECT DISTINCT e FROM Event e
      JOIN FETCH e.activity a
      LEFT JOIN FETCH e.address addr
      LEFT JOIN FETCH e.participants p
      LEFT JOIN FETCH p.user
      WHERE e.deletedAt IS NULL
        AND (
          LOWER(e.title) LIKE LOWER(CONCAT('%', :query, '%'))
          OR LOWER(a.name) LIKE LOWER(CONCAT('%', :query, '%'))
          OR LOWER(CONCAT(
            COALESCE(addr.street, ''), ' ',
            COALESCE(addr.postalCode, ''), ' ',
            COALESCE(addr.city, '')
          )) LIKE LOWER(CONCAT('%', :query, '%'))
        )
    """)
    List<Event> searchActiveEvents(@Param("query") String query);

    List<Event> findByDeletedAtIsNull();

}
