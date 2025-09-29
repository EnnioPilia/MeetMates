package com.example.meetmates.model.link;

import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public class PictureActivityID implements Serializable {

    @Column(name = "picture_id", nullable = false)
    private UUID pictureId;

    @Column(name = "activity_id", nullable = false)
    private UUID activityId;

    public PictureActivityID() {}

    public PictureActivityID(UUID pictureId, UUID activityId) {
        this.pictureId = pictureId;
        this.activityId = activityId;
    }

    public UUID getPictureId() {
        return pictureId;
    }

    public void setPictureId(UUID pictureId) {
        this.pictureId = pictureId;
    }

    public UUID getActivityId() {
        return activityId;
    }

    public void setActivityId(UUID activityId) {
        this.activityId = activityId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof PictureActivityID)) return false;
        PictureActivityID that = (PictureActivityID) o;
        return Objects.equals(pictureId, that.pictureId) &&
               Objects.equals(activityId, that.activityId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(pictureId, activityId);
    }
}
