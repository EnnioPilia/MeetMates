package com.example.meetmates.common.dto;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import org.junit.jupiter.api.Test;

class ApiResponseTest {

    @Test
    void should_create_response_with_message_and_data() {
        // GIVEN
        String message = "Success";
        String data = "payload";

        // WHEN
        ApiResponse<String> response = new ApiResponse<>(message, data);

        // THEN
        assertEquals(message, response.getMessage());
        assertEquals(data, response.getData());
    }

    @Test
    void should_create_response_with_message_only_and_null_data() {
        // GIVEN
        String message = "Operation completed";

        // WHEN
        ApiResponse<Object> response = new ApiResponse<>(message);

        // THEN
        assertEquals(message, response.getMessage());
        assertNull(response.getData());
    }
}
