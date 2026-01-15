package com.example.meetmates.common.service;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import com.example.meetmates.common.exception.ApiException;
import com.example.meetmates.common.exception.ErrorCode;

import jakarta.mail.internet.MimeMessage;

class EmailServiceTest {

    @Mock
    private JavaMailSender mailSender;

    @Mock
    private TemplateEngine templateEngine;

    @Mock
    private MimeMessage mimeMessage;

    @InjectMocks
    private EmailService emailService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);
        when(templateEngine.process(anyString(), any(Context.class))).thenReturn("<html>Mock HTML</html>");

        emailService.setFrontendUrl("http://localhost:3000");
        emailService.setFromEmail("no-reply@test.com");
    }

    @Test
    void should_send_password_reset_email_successfully() throws Exception {
        doNothing().when(mailSender).send(mimeMessage);

        emailService.sendPasswordResetEmail("user@test.com", "token123");

        verify(mailSender).send(mimeMessage);
        verify(templateEngine).process(eq("email/reset-password"), any(Context.class));
    }

    @Test
    void should_throw_exception_if_mail_fails() throws Exception {
        doThrow(new MailException("SMTP fail") {
        }).when(mailSender).send(mimeMessage);

        assertThatThrownBy(() -> emailService.sendPasswordResetEmail("user@test.com", "token123"))
                .isInstanceOf(ApiException.class)
                .hasFieldOrPropertyWithValue("errorCode", ErrorCode.EMAIL_SEND_FAILED);
    }

    @Test
    void should_send_verification_email_successfully() throws Exception {
        doNothing().when(mailSender).send(mimeMessage);

        emailService.sendVerificationEmail("user@test.com", "token123");

        verify(mailSender).send(mimeMessage);
        verify(templateEngine).process(eq("email/verify-account"), any(Context.class));
    }

    @Test
    void should_throw_exception_if_verification_mail_fails() {
        doThrow(new MailException("SMTP fail") {
        }).when(mailSender).send(mimeMessage);

        assertThatThrownBy(() -> emailService.sendVerificationEmail("user@test.com", "token123"))
                .isInstanceOf(ApiException.class)
                .hasFieldOrPropertyWithValue("errorCode", ErrorCode.EMAIL_SEND_FAILED);
    }

}
