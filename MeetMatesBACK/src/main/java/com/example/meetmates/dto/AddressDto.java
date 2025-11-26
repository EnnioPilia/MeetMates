package com.example.meetmates.dto;

import java.util.UUID;

public class AddressDto {

    private UUID id;
    private String street;
    private String city;
    private String postalCode;
    private String type;

    // ====== GETTERS ======
    public UUID getId() {
        return id;
    }

    public String getStreet() {
        return street;
    }

    public String getCity() {
        return city;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public String getType() {
        return type;
    }

    // ====== SETTERS ======
    public void setId(UUID id) {
        this.id = id;
    }

    public void setStreet(String street) {
        this.street = street;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    public void setType(String type) {
        this.type = type;
    }
}
