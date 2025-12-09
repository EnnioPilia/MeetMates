package com.example.meetmates.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.meetmates.model.Address;

/**
 * Repository pour la gestion des entités {@link Address}.
 *
 * Cette interface hérite de {@link JpaRepository} et fournit toutes les opérations
 * CRUD standard pour les adresses, sans nécessiter d’implémentation explicite.
 *
 * L’implémentation du repository est automatiquement générée par Spring Data JPA.
 */
@Repository
public interface AddressRepository extends JpaRepository<Address, UUID> {
}
