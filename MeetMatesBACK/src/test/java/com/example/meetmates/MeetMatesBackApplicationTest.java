package com.example.meetmates;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

/**
 * Test de démarrage de l'application.
 *
 * Vérifie que le contexte Spring se charge correctement
 * sans erreur de configuration.
 */
@SpringBootTest
@ActiveProfiles("test")
class MeetMatesBackApplicationTest {

    @Test
    void contextLoads() {
    }
}
