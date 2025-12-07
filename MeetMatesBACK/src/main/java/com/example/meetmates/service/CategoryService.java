package com.example.meetmates.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.meetmates.exception.ApiException;
import com.example.meetmates.exception.ErrorCode;
import com.example.meetmates.model.Category;
import com.example.meetmates.repository.CategoryRepository;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Transactional(readOnly = true)
    public List<Category> findAll() {
        return categoryRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Category findById(UUID id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ApiException(ErrorCode.CATEGORY_NOT_FOUND));
    }

     @Transactional
    public String save(Category category) {
        categoryRepository.save(category);
        return "CATEGORY_CREATE_SUCCESS"; // 🔥 renvoie un CODE et non la phrase
    }
}
