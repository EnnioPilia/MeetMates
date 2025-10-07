package com.example.meetmates.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.meetmates.model.core.Activity;
import com.example.meetmates.model.core.Address;
import com.example.meetmates.model.core.Event;

@Repository
public interface EventRepository extends JpaRepository<Event, UUID> {

    // Trouver tous les événements d’une activité donnée
    List<Event> findByActivity(Activity activity);

    // Trouver tous les événements à une adresse donnée
    List<Event> findByAddress(Address address);

    // Trouver tous les événements qui commencent après une certaine date
    List<Event> findByEventDateAfter(LocalDateTime date);

    // Trouver tous les événements par statut (OPEN, FULL, CANCELLED, FINISHED)
    List<Event> findByStatus(Event.EventStatus status);

    List<Event> findByActivityId(UUID activityId);

}
