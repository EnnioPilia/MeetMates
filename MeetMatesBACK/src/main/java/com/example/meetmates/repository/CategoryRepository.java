package com.example.meetmates.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.meetmates.model.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category, UUID> {

    // Trouver une catégorie par son nom
    Optional<Category> findByName(String name);

    // Vérifier si une catégorie existe par son nom
    boolean existsByName(String name);
}
