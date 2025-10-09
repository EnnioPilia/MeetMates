package com.example.meetmates.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.meetmates.model.core.Activity;
import com.example.meetmates.model.core.Address;
import com.example.meetmates.model.core.Event;

@Repository
public interface EventRepository extends JpaRepository<Event, UUID> {

    // 🔹 Trouver tous les événements d’une activité donnée
    List<Event> findByActivity(Activity activity);

    // 🔹 Trouver tous les événements à une adresse donnée
    List<Event> findByAddress(Address address);

    // 🔹 Trouver tous les événements qui commencent après une certaine date
    List<Event> findByEventDateAfter(LocalDateTime date);

    // 🔹 Trouver tous les événements par statut
    List<Event> findByStatus(Event.EventStatus status);

    // 🔹 Tous les événements d’une activité
    List<Event> findByActivityId(UUID activityId);

    // ✅ Charger un événement unique avec ses images, activité et adresse
    @Query("""
    SELECT e FROM Event e
    LEFT JOIN FETCH e.pictures ep
    LEFT JOIN FETCH ep.picture pic
    LEFT JOIN FETCH e.activity a
    LEFT JOIN FETCH e.address addr
    WHERE e.id = :id
    """)
    Optional<Event> findByIdWithPictures(@Param("id") UUID id);

    // ✅ Charger tous les événements d’une activité avec leurs images
    @Query("""
    SELECT DISTINCT e FROM Event e
    LEFT JOIN FETCH e.pictures ep
    LEFT JOIN FETCH ep.picture pic
    LEFT JOIN FETCH e.activity a
    LEFT JOIN FETCH e.address addr
    WHERE a.id = :activityId
    """)
    List<Event> findByActivityIdWithPictures(@Param("activityId") UUID activityId);

    // ✅ Charger tous les événements avec leurs images, activité et adresse
    @Query("""
    SELECT DISTINCT e FROM Event e
    LEFT JOIN FETCH e.pictures ep
    LEFT JOIN FETCH ep.picture pic
    LEFT JOIN FETCH e.activity a
    LEFT JOIN FETCH e.address addr
    """)
    List<Event> findAllWithPictures();

@Query("""
    SELECT e FROM Event e
    LEFT JOIN FETCH e.activity
    LEFT JOIN FETCH e.address
    LEFT JOIN FETCH e.pictures p
    LEFT JOIN FETCH p.picture
    WHERE e.id = :id
""")
Optional<Event> findByIdWithAllRelations(@Param("id") UUID id);


}
