package com.example.meetmates.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.from:no-reply@localhost}") 
    private String fromEmail; // chargé depuis .env ou fallback

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    /**
     * Envoie un email de réinitialisation de mot de passe
     * @param toEmail destinataire
     * @param token token brut (UUID)
     */
    public void sendPasswordResetEmail(String toEmail, String token) {
        String subject = "Réinitialisation de votre mot de passe";
        String resetUrl = "http://localhost:4200/reset-password?token=" + token;
        String message = "Pour réinitialiser votre mot de passe, cliquez sur le lien ci-dessous :\n" + resetUrl + "\n\n" +
                "Ce lien est valide pendant 30 minutes.\n\n" +
                "Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.";

        sendEmail(toEmail, subject, message);
    }

    /**
     * Envoie un email de vérification de compte
     * @param toEmail destinataire
     * @param token token brut (UUID)
     */
    public void sendVerificationEmail(String toEmail, String token) {
        String subject = "Vérification de votre compte";
        String verificationUrl = "http://localhost:4200/verify?token=" + token;
        String message = "Merci de cliquer sur le lien ci-dessous pour activer votre compte :\n" + verificationUrl + "\n\n" +
                "Ce lien est valide pendant 24 heures.\n\n" +
                "Si vous n'avez pas créé de compte, ignorez cet email.";

        sendEmail(toEmail, subject, message);
    }

    private void sendEmail(String toEmail, String subject, String message) {
        SimpleMailMessage email = new SimpleMailMessage();
        email.setTo(toEmail);
        email.setSubject(subject);
        email.setText(message);
        email.setFrom(fromEmail); // 🔥 plus de valeur en dur
        mailSender.send(email);
    }
}
