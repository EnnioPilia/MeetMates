package com.example.meetmates.model;

import java.time.LocalDateTime;
import java.util.UUID;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

/**
 * Entité associative représentant la participation d’un utilisateur à un événement.
 *
 * Elle permet de gérer :
 * - le rôle du participant (organisateur, participant)
 * - le statut de participation (en attente, accepté, refusé, parti…)
 * - l’historique d’inscription (date de join)
 * - des informations redondantes utiles (email à l’inscription)
 *
 * Relations :
 * - Many-to-One avec {@link Event} : événement concerné
 * - Many-to-One avec {@link User} : utilisateur participant
 *
 * Particularités :
 * - La combinaison (event_id + user_id) est unique
 * - L’entité sert de pivot pour la gestion des rôles et des statuts
 */
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Entity
@Table(
        name = "event_user",
        uniqueConstraints = {
            @UniqueConstraint(columnNames = {"event_id", "user_id"})
        }
)
public class EventUser {

    /**
     * Identifiant UUID unique de la relation participant–événement .
     * Généré automatiquement par Hibernate via un générateur UUID.
     */
    @Id
    @GeneratedValue
    @JdbcTypeCode(SqlTypes.CHAR)
    @Column(name = "event_user_id", length = 36, updatable = false, nullable = false)
    private UUID id;

    /**
     * L’événement auquel l’utilisateur est associé.
     * Relation Many-To-One : plusieurs EventUser peuvent pointer vers le même Event
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JsonBackReference
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    /**
     * L’utilisateur participant à l’événement.
     * Relation Many-To-One : chaque participant correspond à un user unique
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /**
     * Rôle du participant dans l’événement.
     * Peut être organisateur ou participant simple.
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ParticipantRole role = ParticipantRole.PARTICIPANT;

    /**
     * Statut de participation de l’utilisateur.
     * Permet de gérer les demandes, refus, départs, etc.
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "participation_status", nullable = false)
    private ParticipationStatus participationStatus = ParticipationStatus.PENDING;

    @Column(name = "joined_at", nullable = false)
    private LocalDateTime joinedAt = LocalDateTime.now();

    /**
     * Email de l’utilisateur au moment de l’inscription.
     * Redondant mais utile pour éviter de joindre la table user pour des affichages simples.
     */
    @Column(name = "user_email", nullable = false)
    private String userEmail;


    // -- ENUMS ---
    public enum ParticipantRole {
        ORGANIZER, PARTICIPANT
    }

    public enum ParticipationStatus {
        PENDING, ACCEPTED, REJECTED, LEFT, LEFT_REJECTED
    }


    // --- GETTERS & SETTERS ---
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Event getEvent() { return event; }
    public void setEvent(Event event) { this.event = event; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public ParticipantRole getRole() { return role; }
    public void setRole(ParticipantRole role) { this.role = role; }

    public LocalDateTime getJoinedAt() { return joinedAt; }
    public void setJoinedAt(LocalDateTime joinedAt) { this.joinedAt = joinedAt; }

    public ParticipationStatus getParticipationStatus() { return participationStatus; }
    public void setParticipationStatus(ParticipationStatus participationStatus) { this.participationStatus = participationStatus; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }
}
