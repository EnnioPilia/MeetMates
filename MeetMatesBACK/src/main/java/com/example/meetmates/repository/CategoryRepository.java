package com.example.meetmates.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.meetmates.model.Category;

/**
 * Repository pour la gestion des entités {@link Category}.
 *
 * Cette interface fournit les opérations CRUD standard via {@link JpaRepository},
 * ainsi que des méthodes supplémentaires permettant de rechercher ou vérifier
 * l’existence d’une catégorie à partir de son nom.
 *
 * L’implémentation est automatiquement générée par Spring Data JPA.
 */
@Repository
public interface CategoryRepository extends JpaRepository<Category, UUID> {

    /**
     * Recherche une catégorie par son nom.
     *
     * @param name le nom de la catégorie
     * @return un Optional contenant la catégorie si elle existe
     */
    Optional<Category> findByName(String name);

    /**
     * Vérifie si une catégorie existe en base à partir de son nom.
     *
     * @param name le nom de la catégorie
     * @return true si une catégorie porte ce nom, sinon false
     */
    boolean existsByName(String name);
}
