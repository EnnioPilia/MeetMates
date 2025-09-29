package com.example.meetmates.model.link;

import java.io.Serializable;
import java.util.UUID;

import jakarta.persistence.Embeddable;

@Embeddable
public class PictureCategoryID implements Serializable {

    private UUID pictureId;
    private UUID categoryId;

    public PictureCategoryID() {}

    public PictureCategoryID(UUID pictureId, UUID categoryId) {
        this.pictureId = pictureId;
        this.categoryId = categoryId;
    }

    // Getters & Setters
    public UUID getPictureID() { return pictureId; }
    public void setPictureID(UUID pictureId) { this.pictureId = pictureId; }
    public UUID getCategoryID() { return categoryId; }
    public void setCategoryIID(UUID categoryId) { this.categoryId = categoryId; }

    // hashCode et equals (obligatoire pour clé composite)
    @Override
    public int hashCode() {
        return pictureId.hashCode() ^ categoryId.hashCode();
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (!(obj instanceof PictureCategoryID)) return false;
        PictureCategoryID other = (PictureCategoryID) obj;
        return pictureId.equals(other.pictureId) && categoryId.equals(other.categoryId);
    }
}
