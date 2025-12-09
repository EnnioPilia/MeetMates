package com.example.meetmates.controller;

import java.util.List;
import java.util.Locale;
import java.util.UUID;

import org.springframework.context.MessageSource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.meetmates.dto.AddressDto;
import com.example.meetmates.dto.ApiResponse;
import com.example.meetmates.mapper.AddressMapper;
import com.example.meetmates.model.Address;
import com.example.meetmates.service.AddressService;

import lombok.extern.slf4j.Slf4j;
/**
 * Contrôleur gérant toutes les opérations liées aux adresses :
 *
 * - récupération de toutes les adresses
 * - récupération d'une adresse par son identifiant
 * - création d'une nouvelle adresse
 * - mise à jour d'une adresse existante
 * - suppression d'une adresse
 *
 * Toutes les réponses sont encapsulées dans ApiResponse pour garantir une structure homogène des retours de l'API.
 */
@Slf4j
@RestController
@RequestMapping("/address")
public class AddressController {

    private final AddressService service;
    private final MessageSource messages;

    /**
     * Injection des services nécessaires.
     *
     * @param service service gérant la logique CRUD des adresses
     * @param messages gestionnaire des messages chargés depuis messages.properties (i18n)
     */
    public AddressController(AddressService service, MessageSource messages) {
        this.service = service;
        this.messages = messages;
    }

    /**
     * Permet de récupérer un message localisé depuis messages.properties.
     *
     * @param code clé du message
     * @return message localisé associé
     */
    private String msg(String code) {
        return messages.getMessage(code, null, Locale.getDefault());
    }

    /**
     * Récupère toutes les adresses enregistrées.
     *
     * @return liste des adresses sous forme de DTO
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<AddressDto>>> getAll() {

        var list = service.findAll()
                .stream()
                .map(AddressMapper::toDto)
                .toList();

        return ResponseEntity.ok(
                new ApiResponse<>(msg("ADDRESS_LIST_OK"), list)
        );
    }

    /**
     * Récupère une adresse à partir de son identifiant unique.
     *
     * @param id identifiant UUID de l'adresse
     * @return adresse correspondante si trouvée
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AddressDto>> getById(@PathVariable UUID id) {
        log.info("GET request pour id={}", id);
        var dto = AddressMapper.toDto(service.findById(id));

        log.info("Adresse trouvée pour id={}", id);
        return ResponseEntity.ok(
                new ApiResponse<>(msg("ADDRESS_FOUND_OK"), dto)
        );
    }

    /**
     * Crée une nouvelle adresse.
     *
     * @param dto données de l'adresse à créer
     * @return adresse créée
     */
    @PostMapping
    public ResponseEntity<ApiResponse<AddressDto>> create(@RequestBody AddressDto dto) {
        log.info("Création d'une nouvelle adresse pour street={}", dto.getStreet());
        Address saved = service.create(AddressMapper.toEntity(dto));

        log.info("Adresse créée avec id={}", saved.getId());
        return ResponseEntity.ok(
                new ApiResponse<>(msg("ADDRESS_CREATED_OK"), AddressMapper.toDto(saved))
        );
    }

    /**
     * Met à jour une adresse existante.
     *
     * @param id identifiant de l'adresse à modifier
     * @param dto nouvelles données à appliquer
     * @return adresse mise à jour
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AddressDto>> update(
            @PathVariable UUID id,
            @RequestBody AddressDto dto) {

        log.info("Update request pour id={} avec street={}", id, dto.getStreet());
        Address updated = service.update(id, AddressMapper.toEntity(dto));

        log.info("Adresse mise à jour pour id={}", id);
        return ResponseEntity.ok(
                new ApiResponse<>(msg("ADDRESS_UPDATED_OK"), AddressMapper.toDto(updated))
        );
    }
    
    /**
     * Supprime une adresse à partir de son identifiant.
     *
     * @param id identifiant de l'adresse à supprimer
     * @return message de confirmation
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        log.info("Suppression request pour id={}", id);
        service.delete(id);

        log.info("Adresse supprimée pour id={}", id);
        return ResponseEntity.ok(
                new ApiResponse<>(msg("ADDRESS_DELETED_OK"))
        );
    }
}
