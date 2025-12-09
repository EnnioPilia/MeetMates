package com.example.meetmates.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.meetmates.model.Activity;

/**
 * Repository pour la gestion des entités {@link Activity}.
 *
 * Cette interface fournit les opérations CRUD standard via {@link JpaRepository},
 * ainsi qu’une méthode personnalisée permettant de récupérer des activités selon leur catégorie.
 *
 * Fonctions principales :
 * - Sauvegarder, mettre à jour, supprimer et rechercher des activités
 * - Récupérer les activités associées à une catégorie donnée
 *
 * L’implémentation de ce repository est générée automatiquement par Spring Data JPA.
 */
public interface ActivityRepository extends JpaRepository<Activity, UUID> {

    /**
     * Retourne toutes les activités appartenant à une catégorie spécifique.
     *
     * @param categoryId l’identifiant unique de la catégorie
     * @return une liste d’activités associées à cette catégorie
     */
    List<Activity> findByCategory_CategoryId(UUID categoryId);
}
