package com.example.meetmates.common.service;

import java.util.Locale;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.MessageSource;

@ExtendWith(MockitoExtension.class)
class MessageServiceTest {

    @Mock
    private MessageSource messageSource;

    @InjectMocks
    private MessageService messageService;

    @Test
    void should_return_message_from_message_source() {
        // GIVEN
        when(messageSource.getMessage("greeting", null, "greeting", Locale.getDefault()))
            .thenReturn("Bonjour");

        // WHEN
        String message = messageService.get("greeting");

        // THEN
        assertThat(message).isEqualTo("Bonjour");
    }

    @Test
    void should_return_key_if_message_not_found() {
        // GIVEN
        when(messageSource.getMessage("unknown", null, "unknown", Locale.getDefault()))
            .thenReturn("unknown");

        // WHEN
        String message = messageService.get("unknown");

        // THEN
        assertThat(message).isEqualTo("unknown");
    }
}
