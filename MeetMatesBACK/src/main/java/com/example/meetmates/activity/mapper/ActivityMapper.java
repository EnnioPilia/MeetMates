package com.example.meetmates.activity.mapper;

import org.springframework.stereotype.Component;

import com.example.meetmates.activity.dto.ActivityDto;
import com.example.meetmates.activity.model.Activity;
import com.example.meetmates.category.model.Category;

/**
 * Mapper responsable de la conversion entre les entités {@link Activity}
 * et leur représentation DTO {@link ActivityDto}.
 *
 * Permet de séparer la couche de persistance du modèle exposé
 * via l'API afin d’éviter de renvoyer directement les entités JPA.
 */
@Component
public class ActivityMapper {

    /**
     * Convertit une entité {@link Activity} en {@link ActivityDto}.
     *
     * @param activity l'entité Activity à convertir
     * @return un DTO représentant l'activité, ou {@code null} si l'entité est nulle
     */
    public ActivityDto toDto(Activity activity) {
        if (activity == null) return null;

        return new ActivityDto(
            activity.getId(),
            activity.getName(),
            activity.getCategory() != null ? activity.getCategory().getCategoryId() : null
        );
    }

    /**
     * Convertit un {@link ActivityDto} en entité {@link Activity}.
     * 
     * La catégorie n'est pas extraite du DTO : elle doit être fournie
     * séparément (par exemple récupérée en base par son identifiant).
     *
     * @param dto le DTO contenant les données de l'activité
     * @param category la catégorie liée, déjà chargée
     * @return une nouvelle instance d'Activity initialisée
     */
    public Activity fromDto(ActivityDto dto, Category category) {
        Activity activity = new Activity();
        activity.setId(dto.getId());
        activity.setName(dto.getName());
        activity.setCategory(category);
        return activity;
    }
}
