package com.example.meetmates.common.exception;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import org.junit.jupiter.api.Test;

class ErrorCodeTest {

    @Test
    void should_contain_expected_error_code() {
        // THEN
        assertNotNull(ErrorCode.AUTH_UNAUTHORIZED);
        assertNotNull(ErrorCode.USER_NOT_FOUND);
        assertNotNull(ErrorCode.EVENT_NOT_FOUND);
    }

    @Test
    void name_should_match_enum_constant_name() {
        // GIVEN
        ErrorCode code = ErrorCode.EVENT_FULL;

        // THEN
        assertEquals("EVENT_FULL", code.name());
    }

    @Test
    void should_be_retrievable_from_string_value() {
        // WHEN
        ErrorCode code = ErrorCode.valueOf("USER_BANNED");

        // THEN
        assertEquals(ErrorCode.USER_BANNED, code);
    }
}
