package com.example.meetmates.dto;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

import com.example.meetmates.model.core.Address;
import com.example.meetmates.model.core.Event.EventStatus;
import com.example.meetmates.model.core.Event.Level;
import com.example.meetmates.model.core.Event.MaterialOption;

public class EventRequest {

    private String title;
    private String description;
    private LocalDate eventDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private Integer maxParticipants;
    private EventStatus status;
    private MaterialOption material;
    private Level level;

    private UUID activityId;
    private Address address; 

    // ✅ Getters / Setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDate getEventDate() { return eventDate; }
    public void setEventDate(LocalDate eventDate) { this.eventDate = eventDate; }

    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }

    public LocalTime getEndTime() { return endTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }

    public Integer getMaxParticipants() { return maxParticipants; }
    public void setMaxParticipants(Integer maxParticipants) { this.maxParticipants = maxParticipants; }

    public EventStatus getStatus() { return status; }
    public void setStatus(EventStatus status) { this.status = status; }

    public MaterialOption getMaterial() { return material; }
    public void setMaterial(MaterialOption material) { this.material = material; }

    public Level getLevel() { return level; }
    public void setLevel(Level level) { this.level = level; }

    public UUID getActivityId() { return activityId; }
    public void setActivityId(UUID activityId) { this.activityId = activityId; }

    public Address getAddress() { return address; }
    public void setAddress(Address address) { this.address = address; }
}
