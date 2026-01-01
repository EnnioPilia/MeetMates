package com.example.meetmates.common.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import com.example.meetmates.common.exception.ApiException;
import com.example.meetmates.common.exception.ErrorCode;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;

/**
 * Service pour l'envoi des emails via SMTP.
 * Utilise des templates HTML avec Thymeleaf pour la réinitialisation de mot de passe et la vérification de compte.
 */
@Slf4j
@Service
public class EmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    @Value("${app.mail.from:no-reply@localhost}")
    private String fromEmail;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    public EmailService(JavaMailSender mailSender, TemplateEngine templateEngine) {
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
    }

    /**
     * Envoie un email de réinitialisation du mot de passe à l'utilisateur.
     * Le mail contient un lien vers la page de réinitialisation avec le token associé.
     *
     * @param toEmail adresse email du destinataire
     * @param token   token de réinitialisation du mot de passe
     */
    public void sendPasswordResetEmail(String toEmail, String token) {
        String url = frontendUrl + "/reset-password?token=" + token;

        Context ctx = new Context();
        ctx.setVariable("title", "Réinitialisation du mot de passe");
        ctx.setVariable("actionUrl", url);
        ctx.setVariable("buttonText", "Réinitialiser mon mot de passe");
        ctx.setVariable("content",
                "Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous.");

        String htmlContent = templateEngine.process("email/reset-password", ctx);

        sendHtmlEmail(toEmail, "Réinitialisation de votre mot de passe", htmlContent);
    }

    /**
     * Envoie un email de vérification du compte à l'utilisateur.
     * Le mail contient un lien vers la page de vérification avec le token associé.
     *
     * @param toEmail adresse email du destinataire
     * @param token   token de vérification du compte
     */
    public void sendVerificationEmail(String toEmail, String token) {
        String url = frontendUrl + "/verify?token=" + token;

        Context ctx = new Context();
        ctx.setVariable("title", "Vérification de votre compte");
        ctx.setVariable("actionUrl", url);
        ctx.setVariable("buttonText", "Activer mon compte");
        ctx.setVariable("content",
                "Merci de cliquer sur le bouton ci-dessous pour activer votre compte.");

        String htmlContent = templateEngine.process("email/verify-account", ctx);

        sendHtmlEmail(toEmail, "Activation de votre compte", htmlContent);
    }

    /**
     * Méthode générique pour envoyer un email HTML.
     *
     * @param toEmail     adresse email du destinataire
     * @param subject     objet de l'email
     * @param htmlContent contenu HTML de l'email
     * @throws ApiException si l'envoi échoue
     */
    private void sendHtmlEmail(String toEmail, String subject, String htmlContent) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper =
                    new MimeMessageHelper(mimeMessage, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            mailSender.send(mimeMessage);
            log.info("Email HTML envoyé à {}", toEmail);

        } catch (MessagingException | MailException e) {
            log.error("Erreur lors de l'envoi de l'e-mail HTML à {} : {}", toEmail, e.getMessage());
            throw new ApiException(ErrorCode.EMAIL_SEND_FAILED);
        }
    }

}
