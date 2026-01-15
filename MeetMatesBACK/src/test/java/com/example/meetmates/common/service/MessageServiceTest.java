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
        when(messageSource.getMessage("greeting", null, "greeting", Locale.getDefault()))
            .thenReturn("Bonjour");

        String message = messageService.get("greeting");

        assertThat(message).isEqualTo("Bonjour");
    }

    @Test
    void should_return_key_if_message_not_found() {
        when(messageSource.getMessage("unknown", null, "unknown", Locale.getDefault()))
            .thenReturn("unknown");

        String message = messageService.get("unknown");

        assertThat(message).isEqualTo("unknown");
    }
}
