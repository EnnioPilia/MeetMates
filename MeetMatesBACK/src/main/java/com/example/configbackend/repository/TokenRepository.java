package com.example.configbackend.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import com.example.configbackend.model.Token;
import com.example.configbackend.model.TokenType;

public interface TokenRepository extends JpaRepository<Token, UUID> {

    Optional<Token> findByToken(String token);

    @Transactional
    void deleteByUser_IdAndType(UUID userId, TokenType type); 
}
