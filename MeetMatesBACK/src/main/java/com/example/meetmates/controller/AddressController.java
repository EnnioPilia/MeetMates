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

@Slf4j
@RestController
@RequestMapping("/address")
public class AddressController {

    private final AddressService service;
    private final MessageSource messages;

    public AddressController(AddressService service, MessageSource messages) {
        this.service = service;
        this.messages = messages;
    }

    private String msg(String code) {
        return messages.getMessage(code, null, Locale.getDefault());
    }

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

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AddressDto>> getById(@PathVariable UUID id) {

        var dto = AddressMapper.toDto(service.findById(id));

        return ResponseEntity.ok(
                new ApiResponse<>(msg("ADDRESS_FOUND_OK"), dto)
        );
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AddressDto>> create(@RequestBody AddressDto dto) {

        Address saved = service.create(AddressMapper.fromDto(dto));

        return ResponseEntity.ok(
                new ApiResponse<>(msg("ADDRESS_CREATED_OK"), AddressMapper.toDto(saved))
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AddressDto>> update(
            @PathVariable UUID id,
            @RequestBody AddressDto dto
    ) {

        Address updated = service.update(id, AddressMapper.fromDto(dto));

        return ResponseEntity.ok(
                new ApiResponse<>(msg("ADDRESS_UPDATED_OK"), AddressMapper.toDto(updated))
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {

        service.delete(id);

        return ResponseEntity.ok(
                new ApiResponse<>(msg("ADDRESS_DELETED_OK"))
        );
    }
}
