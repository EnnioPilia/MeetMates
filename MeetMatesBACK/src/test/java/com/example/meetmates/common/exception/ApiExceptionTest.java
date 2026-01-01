package com.example.meetmates.common.exception;

import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.Test;

class ApiExceptionTest {

    @Test
    void should_store_error_code_and_set_message_from_enum_name() {
        // GIVEN
        ErrorCode errorCode = ErrorCode.AUTH_UNAUTHORIZED;

        // WHEN
        ApiException exception = new ApiException(errorCode);

        // THEN
        assertEquals(errorCode, exception.getErrorCode());
        assertEquals("AUTH_UNAUTHORIZED", exception.getMessage());
    }
}
