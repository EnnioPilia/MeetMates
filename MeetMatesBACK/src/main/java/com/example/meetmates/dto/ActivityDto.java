package com.example.meetmates.dto;

import java.util.UUID;

public class ActivityDto {

    private UUID id;
    private String name;
    private UUID categoryId;

    public ActivityDto(UUID id, String name, UUID categoryId) {
        this.id = id;
        this.name = name;
        this.categoryId = categoryId;
    }

    // Getters
    public UUID getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public UUID getCategoryId() {
        return categoryId;
    }

    // Setters
    public void setId(UUID id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setCategoryId(UUID categoryId) {
        this.categoryId = categoryId;
    }
}
