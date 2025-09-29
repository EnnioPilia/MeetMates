package com.example.meetmates.model.link;

import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public class PictureEventID implements Serializable {

    @Column(name = "picture_id", nullable = false)
    private UUID pictureId;

    @Column(name = "event_id", nullable = false)
    private UUID eventId;

    // Constructeurs
    public PictureEventID() {}

    public PictureEventID(UUID pictureId, UUID eventId) {
        this.pictureId = pictureId;
        this.eventId = eventId;
    }

    // Getters & Setters
    public UUID getPictureId() {
        return pictureId;
    }

    public void setPictureId(UUID pictureId) {
        this.pictureId = pictureId;
    }

    public UUID getEventId() {
        return eventId;
    }

    public void setEventId(UUID eventId) {
        this.eventId = eventId;
    }

    // equals & hashCode (OBLIGATOIRE pour clé composite)
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof PictureEventID)) return false;
        PictureEventID that = (PictureEventID) o;
        return Objects.equals(pictureId, that.pictureId) &&
               Objects.equals(eventId, that.eventId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(pictureId, eventId);
    }
}
