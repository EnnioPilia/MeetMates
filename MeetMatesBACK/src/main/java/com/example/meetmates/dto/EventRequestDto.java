package com.example.meetmates.dto;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

import com.example.meetmates.model.Address;
import com.example.meetmates.model.Event.EventStatus;
import com.example.meetmates.model.Event.Level;
import com.example.meetmates.model.Event.MaterialOption;

/**
 * DTO utilisé pour créer ou mettre à jour un événement dans l'application.
 * 
 * Ce DTO représente la structure des données envoyées par le client (front-end)
 * lors de la création (POST) ou de la modification (PUT) d'un événement.
 * 
 * Cette classe regroupe toutes les informations nécessaires à la création
 * d’un événement : titre, description, date, horaires, niveau, matériel, etc.
 */
public class EventRequestDto {

    /** Titre de l'événement. */
    private String title;

    /** Description détaillée de l'événement. */
    private String description;

    /** Date à laquelle se déroule l'événement. */
    private LocalDate eventDate;

    /** Heure de début de l'événement. */
    private LocalTime startTime;

    /** Heure de fin de l'événement. */
    private LocalTime endTime;

    /** Nombre maximal de participants autorisés. */
    private Integer maxParticipants;

    /** Statut de l'événement (ex. : PENDING, ACTIVE, CANCELLED). */
    private EventStatus status;

    /** Option concernant le matériel nécessaire (FOURNI / NON_FOURNI). */
    private MaterialOption material;

    /** Niveau de difficulté de l'événement (BEGINNER, INTERMEDIATE, ADVANCED). */
    private Level level;

    /** Identifiant de l'activité associée à l'événement. */
    private UUID activityId;

    /** Adresse physique où se déroule l'événement. */
    private Address address;


    // --- GETTERS & SETTERS ---

    /** @return titre de l'événement */
    public String getTitle() { return title; }

    /** @param title titre de l'événement */
    public void setTitle(String title) { this.title = title; }

    /** @return description de l'événement */
    public String getDescription() { return description; }

    /** @param description description de l'événement */
    public void setDescription(String description) { this.description = description; }

    /** @return date de l'événement */
    public LocalDate getEventDate() { return eventDate; }

    /** @param eventDate date de l'événement */
    public void setEventDate(LocalDate eventDate) { this.eventDate = eventDate; }

    /** @return heure de début */
    public LocalTime getStartTime() { return startTime; }

    /** @param startTime heure de début */
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }

    /** @return heure de fin */
    public LocalTime getEndTime() { return endTime; }

    /** @param endTime heure de fin */
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }

    /** @return nombre maximal de participants */
    public Integer getMaxParticipants() { return maxParticipants; }

    /** @param maxParticipants nombre maximal de participants */
    public void setMaxParticipants(Integer maxParticipants) { this.maxParticipants = maxParticipants; }

    /** @return statut de l'événement */
    public EventStatus getStatus() { return status; }

    /** @param status statut de l'événement */
    public void setStatus(EventStatus status) { this.status = status; }

    /** @return option matériel */
    public MaterialOption getMaterial() { return material; }

    /** @param material option matériel */
    public void setMaterial(MaterialOption material) { this.material = material; }

    /** @return niveau de l'événement */
    public Level getLevel() { return level; }

    /** @param level niveau de l'événement */
    public void setLevel(Level level) { this.level = level; }

    /** @return identifiant de l'activité liée */
    public UUID getActivityId() { return activityId; }

    /** @param activityId identifiant de l'activité liée */
    public void setActivityId(UUID activityId) { this.activityId = activityId; }

    /** @return adresse de l'événement */
    public Address getAddress() { return address; }

    /** @param address adresse de l'événement */
    public void setAddress(Address address) { this.address = address; }
}
