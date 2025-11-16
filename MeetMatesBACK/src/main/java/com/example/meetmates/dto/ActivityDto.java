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


    // GETTERS & SETTERS
    public UUID getId() {  return id; }
    public void setId(UUID id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public UUID getCategoryId() { return categoryId; }
    public void setCategoryId(UUID categoryId) { this.categoryId = categoryId; }

}
