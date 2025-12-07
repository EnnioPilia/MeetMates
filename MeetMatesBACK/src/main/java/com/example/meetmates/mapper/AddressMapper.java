package com.example.meetmates.mapper;

import com.example.meetmates.dto.AddressDto;
import com.example.meetmates.model.Address;

public class AddressMapper {

    public static AddressDto toDto(Address address) {
        if (address == null) return null;

        AddressDto dto = new AddressDto();
        dto.setId(address.getId());
        dto.setStreet(address.getStreet());
        dto.setPostalCode(address.getPostalCode());
        dto.setCity(address.getCity());
        return dto;
    }

    public static Address toEntity(AddressDto dto) {
        if (dto == null) return null;

        Address address = new Address();
        address.setId(dto.getId()); // ⚠️ seulement si ton entity permet setId()
        address.setStreet(dto.getStreet());
        address.setPostalCode(dto.getPostalCode());
        address.setCity(dto.getCity());
        return address;
    }
}
