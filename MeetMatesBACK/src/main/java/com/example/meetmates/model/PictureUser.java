package com.example.meetmates.model;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "picture_user")
public class PictureUser {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false)
    private String url; 

    @Column(name = "public_id")
    private String publicId; 

    @Column(name = "is_main", nullable = false)
    private boolean isMain = true; 
    
    @Column(nullable = false)
    private String status = "ACTIVE";

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;


    // GETTERS & SETTERS
    public UUID getId() { return id; } 
    public void setId(UUID id) { this.id = id; }

    public String getUrl() { return url; } 
    public void setUrl(String url) { this.url = url; }

    public String getPublicId() { return publicId; } 
    public void setPublicId(String publicId) { this.publicId = publicId; }

    public boolean isMain() { return isMain; } 
    public void setMain(boolean main) { isMain = main; }

    public String getStatus() { return status; } 
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; } 
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; } 
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public User getUser() { return user; } 
    public void setUser(User user) { this.user = user; }
}
