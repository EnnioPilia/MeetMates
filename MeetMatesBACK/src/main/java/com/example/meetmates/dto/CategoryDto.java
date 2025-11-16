package com.example.meetmates.dto;

import java.util.UUID;

public class CategoryDto {
    private UUID id;
    private String name;

    public CategoryDto(UUID id, String name) {
        this.id = id;
        this.name = name;
    }


    // GETTERS & SETTERS
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}
