package com.example.meetmates.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.example.meetmates.exception.ApiException;
import com.example.meetmates.exception.ErrorCode;
import com.example.meetmates.model.Activity;
import com.example.meetmates.repository.ActivityRepository;

import lombok.extern.slf4j.Slf4j;

/**
 * Service gérant les opérations liées aux activités.
 *
 * Fournit des méthodes pour récupérer, filtrer et enregistrer des activités,
 * tout en gérant les erreurs métier via {@link ApiException}.
 */
@Slf4j
@Service
public class ActivityService {

    private final ActivityRepository activityRepository;

    /**
     * Constructeur du service.
     *
     * @param activityRepository le repository permettant l’accès aux données
     * Activity
     */
    public ActivityService(ActivityRepository activityRepository) {
        this.activityRepository = activityRepository;
    }

    /**
     * Récupère toutes les activités disponibles.
     *
     * @return une liste d'activités
     */
    public List<Activity> findAll() {
        log.info("Récupération de toutes les activités");
        return activityRepository.findAll();
    }

    /**
     * Récupère une activité par son identifiant.
     *
     * @param id l’identifiant de l’activité
     * @return l’activité correspondante
     * @throws ApiException si aucune activité ne correspond à l’ID fourni
     */
    public Activity findById(UUID id) {
        log.info("Récupération de l'activité avec ID {}", id);
        return activityRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Aucune activité trouvée pour ID {}", id);
                    return new ApiException(ErrorCode.ACTIVITY_NOT_FOUND);
                });
    }

    /**
     * Récupère toutes les activités appartenant à une catégorie donnée.
     *
     * @param categoryId l’identifiant de la catégorie
     * @return une liste d’activités associées à cette catégorie
     */
    public List<Activity> findByCategory(UUID categoryId) {
        log.info("Récupération des activités pour la catégorie {}", categoryId);
        return activityRepository.findByCategory_CategoryId(categoryId);
    }

    /**
     * Enregistre ou met à jour une activité.
     *
     * @param activity l’activité à sauvegarder
     * @return l’activité enregistrée
     */
    public Activity save(Activity activity) {
        log.info("Enregistrement/mise à jour de l'activité : {}", activity.getName());
        return activityRepository.save(activity);
    }
}
