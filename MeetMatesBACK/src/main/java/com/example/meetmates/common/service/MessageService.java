package com.example.meetmates.common.service;

import java.util.Locale;

import org.springframework.context.MessageSource;
import org.springframework.stereotype.Service;

/**
 * Service pour la gestion des messages localisés.
 * Permet de récupérer les messages à partir des fichiers de propriétés i18n.
 * Si la clé n'existe pas, retourne la clé elle-même en fallback.
 */
@Service
public class MessageService {

    private final MessageSource messageSource;

    public MessageService(MessageSource messageSource) {
        this.messageSource = messageSource;
    }

    /**
     * Récupère le message correspondant à la clé fournie dans la langue par défaut.
     * 
     * @param code clé du message à récupérer
     * @return message localisé ou la clé si aucun message trouvé
     */
    public String get(String code) {
        return messageSource.getMessage(code, null, code, Locale.getDefault());
    }
}
