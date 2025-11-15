package com.example.meetmates.mapper;

import com.example.meetmates.dto.CategoryDto;
import com.example.meetmates.model.Category;

public class CategoryMapper {

    public static CategoryDto toDto(Category category) {
        return new CategoryDto(
                category.getCategoryId(),
                category.getName()
        );
    }

    public static Category fromDto(CategoryDto dto) {
        Category category = new Category();
        category.setCategoryId(dto.getId());
        category.setName(dto.getName());
        return category;
    }
}
