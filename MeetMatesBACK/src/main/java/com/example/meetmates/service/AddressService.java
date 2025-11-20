package com.example.meetmates.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.meetmates.exception.AddressNotFoundException;
import com.example.meetmates.model.Address;
import com.example.meetmates.repository.AddressRepository;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class AddressService {

    private final AddressRepository addressRepository;

    public AddressService(AddressRepository addressRepository) {
        this.addressRepository = addressRepository;
    }

    // * Récupération de toutes les adresses
    @Transactional(readOnly = true)
    public List<Address> findAll() {
        log.info("[ADDRESS] Récupération de toutes les adresses");
        return addressRepository.findAll();
    }

    // * Récupération d'une adresse par son ID (404 si introuvable)
    @Transactional(readOnly = true)
    public Address findById(UUID id) {
        log.info("[ADDRESS] Récupération de l'adresse {}", id);

        return addressRepository.findById(id)
                .orElseThrow(() ->
                        new AddressNotFoundException("❌ Adresse introuvable : ")
                );
    }

    // * Création et enregistrement d'une nouvelle adresse
    @Transactional
    public Address save(Address address) {
        log.info("[ADDRESS] Création d'une nouvelle adresse : {} {}",
                address.getStreet(), address.getCity());

        return addressRepository.save(address);
    }

    // * Suppression d'une adresse (404 si elle n'existe pas)
    @Transactional
    public void delete(UUID id) {
        log.warn("[ADDRESS] Demande de suppression de l'adresse {}", id);

        if (!addressRepository.existsById(id)) {
            throw new AddressNotFoundException("❌ Impossible de supprimer : adresse introuvable.");
        }

        addressRepository.deleteById(id);
        log.info("[ADDRESS] Adresse {} supprimée avec succès", id);
    }

    // * Mise à jour d'une adresse existante (404 si introuvable)
    @Transactional
    public Address update(UUID id, Address details) {
        log.info("[ADDRESS] Mise à jour de l'adresse {}", id);

        return addressRepository.findById(id)
                .map(address -> {
                    address.setStreet(details.getStreet());
                    address.setCity(details.getCity());
                    address.setPostalCode(details.getPostalCode());
                    address.setType(details.getType());

                    log.info("[ADDRESS] Adresse {} mise à jour", id);

                    return addressRepository.save(address);
                })
                .orElseThrow(() ->
                        new AddressNotFoundException("❌ Adresse introuvable : ")
                );
    }
}
