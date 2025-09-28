package com.example.meetmates.model.link;

import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

import jakarta.persistence.Embeddable;

@Embeddable
public class EventUserID implements Serializable {

    private UUID eventId;
    private UUID userId;

    public EventUserID() {}

    public EventUserID(UUID eventId, UUID userId) {
        this.eventId = eventId;
        this.userId = userId;
    }

    // Getters & Setters
    public UUID getEventId() { return eventId; }
    public void setEventId(UUID eventId) { this.eventId = eventId; }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }

    // equals() & hashCode()
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof EventUserID)) return false;
        EventUserID that = (EventUserID) o;
        return Objects.equals(eventId, that.eventId) && Objects.equals(userId, that.userId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(eventId, userId);
    }
}
