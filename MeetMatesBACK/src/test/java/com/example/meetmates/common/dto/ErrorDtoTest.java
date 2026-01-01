package com.example.meetmates.common.dto;

import java.time.Instant;

import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.Test;

class ErrorDtoTest {

    @Test
    void should_create_error_dto_with_all_fields() {
        // GIVEN
        Instant timestamp = Instant.now();
        int status = 404;
        String error = "Not Found";
        String message = "Resource not found";
        String path = "/api/events/1";

        // WHEN
        ErrorDto dto = new ErrorDto(
                timestamp,
                status,
                error,
                message,
                path
        );

        // THEN
        assertEquals(timestamp, dto.timestamp());
        assertEquals(status, dto.status());
        assertEquals(error, dto.error());
        assertEquals(message, dto.message());
        assertEquals(path, dto.path());
    }
}
