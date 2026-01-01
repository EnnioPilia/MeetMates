package com.example.meetmates.category.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.meetmates.category.model.Category;
import com.example.meetmates.category.repository.CategoryRepository;
import com.example.meetmates.common.exception.ApiException;
import com.example.meetmates.common.exception.ErrorCode;

import lombok.extern.slf4j.Slf4j;

/**
 * Service gérant les opérations sur les catégories. Fournit des méthodes pour
 * récupérer, créer et rechercher des catégories. Les exceptions métier sont
 * levées lorsque les entités ne sont pas trouvées.
 */
@Slf4j
@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    /**
     * Constructeur du service de catégories.
     *
     * @param categoryRepository repository pour accéder aux données des
     * catégories
     */
    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    /**
     * Récupère toutes les catégories disponibles.
     *
     * @return liste de toutes les catégories
     */
    @Transactional(readOnly = true)
    public List<Category> findAll() {
        log.info("Récupération de toutes les catégories");
        return categoryRepository.findAll();
    }

    /**
     * Récupère une catégorie par son identifiant.
     *
     * @param id identifiant de la catégorie
     * @return la catégorie correspondante
     * @throws ApiException si la catégorie n'est pas trouvée
     */
    @Transactional(readOnly = true)
    public Category findById(UUID id) {
        log.info("Récupération de la catégorie avec l'ID {}", id);

        return categoryRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Catégorie non trouvée pour l'ID {}", id);
                    return new ApiException(ErrorCode.CATEGORY_NOT_FOUND);
                });
    }

    /**
     * Enregistre une nouvelle catégorie en base de données.
     *
     * @param category la catégorie à créer
     * @return code de succès indiquant que la catégorie a été créée
     */
    @Transactional
    public String save(Category category) {
        log.info("Création d'une nouvelle catégorie : {}", category.getName());
        categoryRepository.save(category);
        
        return "CATEGORY_CREATE_SUCCESS";
    }
}
