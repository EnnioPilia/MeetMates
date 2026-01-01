package com.example.meetmates.auth.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import com.example.meetmates.auth.model.Token;
import com.example.meetmates.auth.model.TokenType;

/**
 * Repository dédié à la gestion des entités {@link Token}.
 *
 * Permet de rechercher, charger et supprimer des jetons d'authentification
 * ou de vérification associés à un utilisateur. Les opérations CRUD standard
 * sont fournies automatiquement par {@link JpaRepository}.
 *
 * Ce repository gère notamment :
 * - la récupération d’un token brut,
 * - la suppression par utilisateur et type de token,
 * - le chargement d’un token avec son utilisateur associé.
 */
public interface TokenRepository extends JpaRepository<Token, UUID> {

    /**
     * Recherche un token via sa valeur textuelle.
     *
     * @param token la valeur brute du token
     * @return un Optional contenant le token s'il existe
     */
    Optional<Token> findByToken(String token);

    /**
     * Supprime un token en fonction de l'identifiant utilisateur
     * et du type de token.
     *
     * @param userId identifiant de l'utilisateur
     * @param type type du token à supprimer
     */
    @Transactional
    void deleteByUser_IdAndType(UUID userId, TokenType type);

    /**
     * Recherche un token et charge simultanément l'utilisateur associé.
     *
     * @param token la valeur brute du token
     * @return un Optional contenant le token avec l’utilisateur chargé
     */
    @Query("""
        SELECT t FROM Token t
        JOIN FETCH t.user
        WHERE t.token = :token
        """)
    Optional<Token> findByTokenWithUser(String token);

    /**
     * Supprime tous les tokens d'un utilisateur donné.
     *
     * @param userId identifiant de l'utilisateur
     */
    void deleteByUser_Id(UUID userId);
}
