package com.example.meetmates.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * DTO représentant une adresse envoyée par le client lors de la création
 * ou de la mise à jour d’un événement.
 *
 * Cette classe est utilisée uniquement en entrée (request) pour recevoir
 * les informations d’adresse depuis le front-end.
 *
 * Tous les champs sont obligatoires et validés via les annotations
 * {@link jakarta.validation.constraints.NotBlank}.
 */

public class AddressRequestDto {

    @NotBlank
    private String street;

    @NotBlank
    private String city;

    @NotBlank
    private String postalCode;

    // --- GETTERS & SETTERS ---
    public String getStreet() { return street; }
    public void setStreet(String street) { this.street = street; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getPostalCode() { return postalCode; }
    public void setPostalCode(String postalCode) { this.postalCode = postalCode; }
}
