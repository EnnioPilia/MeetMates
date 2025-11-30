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

@Slf4j
@Service
public class AddressService {

    private final AddressRepository repo;

    public AddressService(AddressRepository repo) {
        this.repo = repo;
    }

    @Transactional(readOnly = true)
    public List<Address> findAll() {
        return repo.findAll();
    }

    @Transactional(readOnly = true)
    public Address findById(UUID id) {
        return repo.findById(id)
                .orElseThrow(() -> new ApiException(ErrorCode.ADDRESS_NOT_FOUND));
    }

    @Transactional
    public Address create(Address address) {
        return repo.save(address);
    }

    @Transactional
    public Address update(UUID id, Address details) {
        return repo.findById(id)
                .map(a -> {
                    a.setStreet(details.getStreet());
                    a.setCity(details.getCity());
                    a.setPostalCode(details.getPostalCode());
                    a.setType(details.getType());
                    return repo.save(a);
                })
                .orElseThrow(() -> new ApiException(ErrorCode.ADDRESS_NOT_FOUND));
    }

    @Transactional
    public void delete(UUID id) {
        if (!repo.existsById(id)) {
            throw new ApiException(ErrorCode.ADDRESS_NOT_FOUND);
        }
        repo.deleteById(id);
    }
}
