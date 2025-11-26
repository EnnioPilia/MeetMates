package com.example.meetmates.mapper;

import com.example.meetmates.dto.AddressDto;
import com.example.meetmates.model.Address;

public class AddressMapper {

    public static AddressDto toDto(Address address) {
        if (address == null) return null;

        AddressDto dto = new AddressDto();
        dto.setId(address.getId());
        dto.setStreet(address.getStreet());
        dto.setCity(address.getCity());
        dto.setPostalCode(address.getPostalCode());

        return dto;
    }

    public static Address fromDto(AddressDto dto) {
        Address address = new Address();

        address.setStreet(dto.getStreet());
        address.setCity(dto.getCity());
        address.setPostalCode(dto.getPostalCode());

        return address;
    }
}
