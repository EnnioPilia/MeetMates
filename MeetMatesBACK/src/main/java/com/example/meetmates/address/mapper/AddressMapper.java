package com.example.meetmates.address.mapper;

import com.example.meetmates.address.dto.AddressDto;
import com.example.meetmates.address.dto.AddressRequestDto;
import com.example.meetmates.address.model.Address;

/**
 * Mapper utilitaire permettant de convertir entre l'entité {@link Address} et
 * ses différents DTOs utilisés par l'application.
 *
 * Ce mapper permet notamment : -la conversion d'une entité {@link Address} vers
 * un {@link AddressDto} destiné aux réponses envoyées au front</li>
 * -la conversion d'un {@link AddressRequestDto} vers une entité {@link Address}
 * lors de la création ou mise à jour d'un événement
 *
 * Les mappers permettent de séparer les modèles persistants (entités JPA) des
 * objets échangés avec le front (DTO).
 */
public class AddressMapper {

    /**
     * Convertit une entité {@link Address} en un {@link AddressDto}.
     *
     * @param address l'entité Address à convertir (peut être {@code null})
     * @return un DTO contenant les données de l'adresse, ou {@code null} si
     * l'entité est null
     */
    public static AddressDto toDto(Address address) {
        if (address == null) {
            return null;
        }

        AddressDto dto = new AddressDto();
        dto.setId(address.getId());
        dto.setStreet(address.getStreet());
        dto.setPostalCode(address.getPostalCode());
        dto.setCity(address.getCity());
        return dto;
    }

    /**
     * Convertit un {@link AddressRequestDto} en une entité {@link Address}.
     * 
     * Cette méthode est utilisée lors de la création ou de la mise à jour d'un
     * événement.
     *
     * @param dto le DTO contenant les informations d'adresse (peut être
     * {@code null})
     * @return une entité Address contenant les données du DTO, ou {@code null}
     * si le DTO est null
     */
    public static Address toEntity(AddressRequestDto dto) {
        if (dto == null) {
            return null;
        }

        Address address = new Address();
        address.setStreet(dto.getStreet());
        address.setCity(dto.getCity());
        address.setPostalCode(dto.getPostalCode());
        return address;
    }
}
