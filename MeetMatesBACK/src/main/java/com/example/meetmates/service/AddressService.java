package com.example.meetmates.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.example.meetmates.model.core.Address;
import com.example.meetmates.repository.AddressRepository;

@Service
public class AddressService {

    private final AddressRepository addressRepository;

    public AddressService(AddressRepository addressRepository) {
        this.addressRepository = addressRepository;
    }

    public List<Address> findAll() {
        return addressRepository.findAll();
    }

    public Address findById(UUID id) {
        return addressRepository.findById(id).orElse(null);
    }

    public Address save(Address address) {
        return addressRepository.save(address);
    }

    public void delete(UUID id) {
        addressRepository.deleteById(id);
    }

    public Address update(UUID id, Address details) {
        return addressRepository.findById(id).map(address -> {
            address.setStreet(details.getStreet());
            address.setCity(details.getCity());
            address.setPostalCode(details.getPostalCode());
            address.setType(details.getType());
            return addressRepository.save(address);
        }).orElse(null);
    }
}
