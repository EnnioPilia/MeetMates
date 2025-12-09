package com.example.meetmates.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.meetmates.exception.ApiException;
import com.example.meetmates.exception.ErrorCode;
import com.example.meetmates.model.Address;
import com.example.meetmates.repository.AddressRepository;

import lombok.extern.slf4j.Slf4j;

/**
 * Service responsable de la gestion des adresses.
 * 
 * Fournit des opérations CRUD avec gestion d’exceptions métier via {@link ApiException}.
 */
@Slf4j
@Service
public class AddressService {

    private final AddressRepository repo;

    /**
     * Constructeur du service.
     *
     * @param repo repository permettant l'accès aux données Address
     */
    public AddressService(AddressRepository repo) {
        this.repo = repo;
    }

    /**
     * Récupère toutes les adresses présentes en base.
     *
     * @return une liste d'adresses
     */
    @Transactional(readOnly = true)
    public List<Address> findAll() {
        return repo.findAll();
    }

    /**
     * Récupère une adresse par son identifiant.
     *
     * @param id l’ID de l’adresse
     * @return l’adresse correspondante
     * @throws ApiException si aucune adresse ne correspond à l’ID fourni
     */
    @Transactional(readOnly = true)
    public Address findById(UUID id) {
        return repo.findById(id)
                .orElseThrow(() -> new ApiException(ErrorCode.ADDRESS_NOT_FOUND));
    }

    /**
     * Crée une nouvelle adresse.
     *
     * @param address l’adresse à enregistrer
     * @return l’adresse sauvegardée
     */
    @Transactional
    public Address create(Address address) {
        return repo.save(address);
    }

    /**
     * Met à jour les informations d’une adresse existante.
     *
     * @param id l’ID de l’adresse à modifier
     * @param details les nouvelles valeurs à appliquer
     * @return l’adresse mise à jour
     * @throws ApiException si l’adresse n’existe pas
     */
    @Transactional
    public Address update(UUID id, Address details) {
        return repo.findById(id)
                .map(a -> {
                    a.setStreet(details.getStreet());
                    a.setCity(details.getCity());
                    a.setPostalCode(details.getPostalCode());
                    return repo.save(a);
                })
                .orElseThrow(() -> new ApiException(ErrorCode.ADDRESS_NOT_FOUND));
    }

    /**
     * Supprime une adresse par son identifiant.
     *
     * @param id l’ID de l’adresse à supprimer
     * @throws ApiException si l’adresse n’existe pas
     */
    @Transactional
    public void delete(UUID id) {
        if (!repo.existsById(id)) {
            throw new ApiException(ErrorCode.ADDRESS_NOT_FOUND);
        }
        repo.deleteById(id);
    }
}
