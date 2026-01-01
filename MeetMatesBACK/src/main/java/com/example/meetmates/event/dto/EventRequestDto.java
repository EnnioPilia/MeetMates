package com.example.meetmates.event.dto;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

import com.example.meetmates.address.dto.AddressRequestDto;
import com.example.meetmates.event.model.Event.EventStatus;
import com.example.meetmates.event.model.Event.Level;
import com.example.meetmates.event.model.Event.MaterialOption;

/**
 * DTO utilisé pour créer ou mettre à jour un événement dans l'application.
 *
 * Ce DTO représente la structure des données envoyées par le client
 * (front-end) lors de la création (POST) ou de la modification (PUT)
 * d'un événement.
 *
 * Il regroupe toutes les informations nécessaires à la gestion d’un événement :
 * titre, description, date, horaires, nombre de participants, statut,
 * niveau, matériel, activité associée ainsi que l’adresse de l’événement.
 */
public class EventRequestDto {

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
    private AddressRequestDto address;


    // --- GETTERS & SETTERS ---
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

    public AddressRequestDto getAddress() { return address; }
    public void setAddress(AddressRequestDto address) { this.address = address; }
}
