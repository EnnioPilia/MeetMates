package com.example.meetmates.model.link;

import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public class PictureUserID implements Serializable {

    @Column(name = "picture_id", nullable = false)
    private UUID pictureId;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    public PictureUserID() {}

    public PictureUserID(UUID pictureId, UUID userId) {
        this.pictureId = pictureId;
        this.userId = userId;
    }

    public UUID getPictureId() {
        return pictureId;
    }

    public void setPictureId(UUID pictureId) {
        this.pictureId = pictureId;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof PictureUserID)) return false;
        PictureUserID that = (PictureUserID) o;
        return Objects.equals(pictureId, that.pictureId) &&
               Objects.equals(userId, that.userId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(pictureId, userId);
    }
}
