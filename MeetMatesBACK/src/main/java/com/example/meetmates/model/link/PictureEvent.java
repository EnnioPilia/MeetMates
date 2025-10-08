package com.example.meetmates.model.link;

import java.time.LocalDateTime;

import com.example.meetmates.model.core.Event;
import com.example.meetmates.model.media.Picture;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

@Entity
@Table(name = "picture_event")
public class PictureEvent {

    @EmbeddedId
    private PictureEventID id = new PictureEventID();

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("pictureId")
    @JoinColumn(name = "picture_id", nullable = false)
    private Picture picture;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("eventId")
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @Column(name = "is_main", nullable = false)
    private boolean isMain = false;

    @Column(nullable = false)
    private String status = "ACTIVE";

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // === Constructeurs ===
    public PictureEvent() {}

    public PictureEvent(Picture picture, Event event, boolean isMain) {
        this.picture = picture;
        this.event = event;
        this.id = new PictureEventID(picture.getId(), event.getId());
        this.isMain = isMain;
    }

    // === Getters & Setters ===
    public PictureEventID getId() {
        return id;
    }

    public void setId(PictureEventID id) {
        this.id = id;
    }

    public Picture getPicture() {
        return picture;
    }

    public void setPicture(Picture picture) {
        this.picture = picture;
        if (picture != null && event != null) {
            this.id = new PictureEventID(picture.getId(), event.getId());
        }
    }

    public Event getEvent() {
        return event;
    }

    public void setEvent(Event event) {
        this.event = event;
        if (picture != null && event != null) {
            this.id = new PictureEventID(picture.getId(), event.getId());
        }
    }

    public boolean isMain() {
        return isMain;
    }

    public void setMain(boolean main) {
        isMain = main;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    // === Callbacks automatiques ===
    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
