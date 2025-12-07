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

@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Entity
@Table(name = "addresses")
public class Address {

    @Id
    @GeneratedValue
    @JdbcTypeCode(SqlTypes.CHAR)
    @Column(length = 36, updatable = false, nullable = false)
    private UUID id;

    private String street;
    private String city;
    private String postalCode;

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

    // GETTERS & SETTERS
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getStreet() { return street; }
    public void setStreet(String street) { this.street = street; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getPostalCode() { return postalCode; }
    public void setPostalCode(String postalCode) { this.postalCode = postalCode; }
}
