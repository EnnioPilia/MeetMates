package com.example.meetmates.dto;

import java.util.UUID;

/**
 * DTO représentant une adresse dans l'application.
 * 
 * Utilisé pour transporter les données entre les couches sans exposer l'entité JPA.
 */
public class AddressDto {

    /** Identifiant unique de l’adresse. */
    private UUID id;

    /** Rue associée à l’adresse. */
    private String street;

    /** Ville associée à l’adresse. */
    private String city;

    /** Code postal de l’adresse. */
    private String postalCode;

    // GETTERS
    public UUID getId() { return id; }
    public String getStreet() { return street; }
    public String getCity() { return city; }
    public String getPostalCode() { return postalCode; }

    // SETTERS
    public void setId(UUID id) { this.id = id; }
    public void setStreet(String street) { this.street = street; }
    public void setCity(String city) { this.city = city; }
    public void setPostalCode(String postalCode) { this.postalCode = postalCode; }
}
