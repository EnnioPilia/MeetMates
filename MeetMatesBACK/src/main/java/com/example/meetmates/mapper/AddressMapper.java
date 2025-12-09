package com.example.meetmates.mapper;

import com.example.meetmates.dto.AddressDto;
import com.example.meetmates.model.Address;

/**
 * Mapper utilitaire permettant de convertir entre l'entité {@link Address}
 * et son DTO {@link AddressDto}.
 *
 * Les mappers permettent de séparer les modèles persistants (entités JPA)
 * des objets échangés avec le front (DTO).
 */
public class AddressMapper {

    /**
     * Convertit une entité {@link Address} en un objet {@link AddressDto}.
     *
     * @param address l'entité Address à convertir (peut être {@code null})
     * @return un DTO contenant les mêmes données, ou {@code null} si l'entité est null
     */
    public static AddressDto toDto(Address address) {
        if (address == null) return null;

        AddressDto dto = new AddressDto();
        dto.setId(address.getId());
        dto.setStreet(address.getStreet());
        dto.setPostalCode(address.getPostalCode());
        dto.setCity(address.getCity());
        return dto;
    }

    /**
     * Convertit un objet {@link AddressDto} en une entité {@link Address}.
     *
     * Note : le champ id est recopié uniquement si l'entité autorise la modification de l'identifiant.
     *
     * @param dto le DTO à convertir (peut être {@code null})
     * @return une entité Address contenant les données du DTO, ou {@code null} si le DTO est null
     */
    public static Address toEntity(AddressDto dto) {
        if (dto == null) return null;

        Address address = new Address();
        address.setId(dto.getId()); 
        address.setStreet(dto.getStreet());
        address.setPostalCode(dto.getPostalCode());
        address.setCity(dto.getCity());
        return address;
    }
}
