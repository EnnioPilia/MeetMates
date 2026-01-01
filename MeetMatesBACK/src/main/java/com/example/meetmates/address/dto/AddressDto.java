package com.example.meetmates.address.dto;

import java.util.UUID;

/**
 * DTO représentant une adresse dans l'application.
 *
 * Utilisé pour transférer des données entre les couches sans exposer l'entité JPA.
 */
public class AddressDto {

    private UUID id;
    private String street;
    private String city;
    private String postalCode;

    public AddressDto() {}
    /**
     * Construit un DTO représentant une adresse.
     * @param id identifiant unique de l’adresse
     * @param street rue de l’adresse
     * @param city ville associée
     * @param postalCode code postal de l’adresse
     */
    public AddressDto(UUID id, String street, String city, String postalCode) {
        this.id = id;
        this.street = street;
        this.city = city;
        this.postalCode = postalCode;
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
