package com.example.meetmates.service;

import java.util.Locale;

import org.springframework.context.MessageSource;
import org.springframework.stereotype.Service;

@Service
public class MessageService {

    private final MessageSource messageSource;

    public MessageService(MessageSource messageSource) {
        this.messageSource = messageSource;
    }

    /**
     * Retourne le message pour la clé fournie.
     * Si la clé n'existe pas, on renvoie la clé elle-même (fallback).
     */
    public String get(String code) {
        return messageSource.getMessage(code, null, code, Locale.getDefault());
    }
}
