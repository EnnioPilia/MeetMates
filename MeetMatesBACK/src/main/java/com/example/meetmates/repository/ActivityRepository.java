package com.example.meetmates.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.meetmates.model.Activity;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, UUID> {

    // Exemple : chercher une activité par son nom
    Optional<Activity> findByName(String name);

    boolean existsByName(String name);
}
