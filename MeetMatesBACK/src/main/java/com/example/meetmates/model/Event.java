package com.example.meetmates.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

/**
 * Entité représentant un événement créé par les utilisateurs.
 *
 * L’entité stocke :
 * - un titre, une description et une date
 * - un créneau horaire (début / fin)
 * - un nombre maximal de participants (optionnel)
 * - plusieurs propriétés métier (niveau, matériel requis, statut)
 *
 * Relations :
 * - One-to-One avec {@link Address} : adresse complète de l’événement
 * - Many-to-One avec {@link Activity} : catégorie / type d’activité
 * - One-to-Many avec {@link EventUser} : participants inscrits ou en attente
 *
 * L’entité gère également :
 * - les métadonnées (création, mise à jour, suppression logique)
 * - le soft delete via {@code deletedAt}
 */
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Entity
@Table(name = "events")
public class Event {

    /**
     * Identifiant unique UUID de l’événement.
     * Généré automatiquement par Hibernate via un générateur UUID.
     */
    @Id
    @GeneratedValue
    @JdbcTypeCode(SqlTypes.CHAR)
    @Column(name = "event_id", length = 36, updatable = false, nullable = false)
    private UUID id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "event_date", nullable = false)
    private LocalDate eventDate;

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    @Column(name = "max_participants")
    private Integer maxParticipants;

    /**
     * Statut global de l’événement (ouvert, complet, annulé…).
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EventStatus status = EventStatus.OPEN;

    /**
     * Indique si un matériel est fourni, requis ou non nécessaire.
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MaterialOption material = MaterialOption.NOT_REQUIRED;

    /**
     * Niveau de difficulté ou d'expérience prévu pour l'événement.
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Level level = Level.ALL_LEVELS;

    /**
     * Adresse de l’événement.
     * Relation One-to-One avec suppression en cascade.
     */
    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "address_id", nullable = false)
    private Address address;

    /**
     * Activité associée à l’événement.
     * Relation Many-to-One : une activité peut contenir plusieurs événements.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "activity_id", nullable = false)
    @JdbcTypeCode(SqlTypes.CHAR)
    private Activity activity;

    /**
     * Liste des participants inscrits à l’événement.
     * Relation One-to-Many : un événement possède plusieurs EventUser.
     * Supprimer un événement supprime toutes les participations associées (orphanRemoval = true).
     */
    @OneToMany(mappedBy = "event", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<EventUser> participants = new ArrayList<>();

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;


    // --- ENUMS ---
    public enum EventStatus {
        OPEN, FULL, CANCELLED, FINISHED
    }

    public enum MaterialOption {
        PROVIDED, YOUR_OWN, NOT_REQUIRED
    }

    public enum Level {
        BEGINNER, INTERMEDIATE, EXPERT, ALL_LEVELS
    }


    // --- GETTERS & SETTERS ---
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDate getEventDate() { return eventDate; }
    public void setEventDate(LocalDate eventDate) { this.eventDate = eventDate; }

    public List<EventUser> getParticipants() { return participants; }
    public void setParticipants(List<EventUser> participants) { this.participants = participants; }

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

    public Address getAddress() { return address; }
    public void setAddress(Address address) { this.address = address; }

    public Activity getActivity() { return activity; }
    public void setActivity(Activity activity) { this.activity = activity; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public LocalDateTime getDeletedAt() { return deletedAt; }
    public void setDeletedAt(LocalDateTime deletedAt) { this.deletedAt = deletedAt; }
}
