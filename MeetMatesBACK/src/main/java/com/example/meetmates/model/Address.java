package com.example.meetmates.model;

import java.util.UUID;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/**
 * Entité représentant une adresse dans l'application.
 *
 * Une adresse contient une rue, une ville et un code postal, ainsi qu’un
 * identifiant unique généré automatiquement. Cette entité est utilisée
 * notamment pour localiser les événements.
 */
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Entity
@Table(name = "addresses")
public class Address {

    /**
     * Identifiant UUID unique de l’adresse.
     * Généré automatiquement par Hibernate via un générateur UUID.
     */
    @Id
    @GeneratedValue
    @JdbcTypeCode(SqlTypes.CHAR)
    @Column(length = 36, updatable = false, nullable = false)
    private UUID id;

    /** Rue de l’adresse. */
    private String street;

    /** Ville de l’adresse. */
    private String city;

    /** Code postal de l’adresse. */
    private String postalCode;

    /**
     * Construit une chaîne représentant l’adresse complète.
     *
     * @return adresse formatée, sans espaces superflus
     */
    public String getFullAddress() {
        StringBuilder sb = new StringBuilder();
        if (street != null) {
            sb.append(street);
        }
        if (postalCode != null) {
            sb.append(", ").append(postalCode);
        }
        if (city != null) {
            sb.append(" ").append(city);
        }
        return sb.toString().trim();
    }


    // --- GETTERS & SETTERS ---
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getStreet() { return street; }
    public void setStreet(String street) { this.street = street; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getPostalCode() { return postalCode; }
    public void setPostalCode(String postalCode) { this.postalCode = postalCode; }
}
