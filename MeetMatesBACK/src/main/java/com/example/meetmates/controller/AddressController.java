package com.example.meetmates.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.meetmates.model.Address;
import com.example.meetmates.service.AddressService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/address")
@CrossOrigin(origins = "*")
public class AddressController {

    private final AddressService addressService;

    public AddressController(AddressService addressService) {
        this.addressService = addressService;
    }

    // * Récupère toutes les adresses
    @GetMapping
    public ResponseEntity<List<Address>> getAll() {
        log.info("[ADDRESS CTRL] GET /address - Récupération de toutes les adresses");
        return ResponseEntity.ok(addressService.findAll());
    }

    // * Récupère une adresse grâce à son ID
    @GetMapping("/{id}")
    public ResponseEntity<Address> getById(@PathVariable UUID id) {
        log.info("[ADDRESS CTRL] GET /address/{} - Récupération d'une adresse", id);
        return ResponseEntity.ok(addressService.findById(id));
    }

    // * Crée une nouvelle adresse
    @PostMapping
    public ResponseEntity<Address> create(@RequestBody Address address) {
        log.info("[ADDRESS CTRL] POST /address - Création d'une adresse");
        return ResponseEntity.ok(addressService.save(address));
    }

    // * Met à jour une adresse existante
    @PutMapping("/{id}")
    public ResponseEntity<Address> update(@PathVariable UUID id, @RequestBody Address addressDetails) {
        log.info("[ADDRESS CTRL] PUT /address/{} - Mise à jour de l'adresse", id);
        return ResponseEntity.ok(addressService.update(id, addressDetails));
    }

    // * Supprime une adresse grâce à son ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        log.warn("[ADDRESS CTRL] DELETE /address/{} - Suppression d'une adresse", id);
        addressService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
