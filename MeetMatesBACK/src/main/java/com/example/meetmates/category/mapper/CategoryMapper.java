package com.example.meetmates.category.mapper;

import com.example.meetmates.category.dto.CategoryDto;
import com.example.meetmates.category.model.Category;

/**
 * Mapper utilitaire permettant de convertir entre l'entité {@link Category}
 * et son DTO {@link CategoryDto}.
 *
 * Les mappers servent à isoler les objets de persistence (entités JPA)
 * des objets envoyés ou reçus via l'API (DTO).
 */
public class CategoryMapper {

    /**
     * Convertit une entité {@link Category} en un {@link CategoryDto}.
     *
     * @param category l'entité à convertir (ne doit pas être null)
     * @return un DTO contenant l'identifiant et le nom de la catégorie
     */
    public static CategoryDto toDto(Category category) {
        return new CategoryDto(
                category.getCategoryId(),
                category.getName()
        );
    }

    /**
     * Convertit un {@link CategoryDto} en une entité {@link Category}.
     *
     * @param dto le DTO à convertir (ne doit pas être null)
     * @return une nouvelle entité Category initialisée à partir du DTO
     */
    public static Category fromDto(CategoryDto dto) {
        Category category = new Category();
        category.setCategoryId(dto.getId());
        category.setName(dto.getName());
        return category;
    }
}
