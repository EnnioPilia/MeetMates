package com.example.meetmates;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Point d'entrée principal de l'application MeetMates.
 * 
 * Cette classe initialise et démarre l'application Spring Boot,
 * en chargeant le contexte global (configuration, services, contrôleurs, sécurité, etc.).
 */
@SpringBootApplication
public class MeetMatesBackApplication {

    /**
     * Méthode principale exécutée au démarrage de l'application.
     *
     * @param args arguments de la ligne de commande (non utilisés)
     */
    public static void main(String[] args) {
        SpringApplication.run(MeetMatesBackApplication.class, args);
    }
}
