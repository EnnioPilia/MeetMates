package com.example.meetmates.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.meetmates.model.core.User;

public interface UserRepository extends JpaRepository<User, UUID> {

    // ✅ Méthode standard (lazy)
    Optional<User> findByEmail(String email);

    // ✅ Nouvelle méthode qui force un chargement complet (évite LazyInitializationException)
    @Query("SELECT u FROM User u WHERE u.email = :email")
    Optional<User> findByEmailEager(@Param("email") String email);
}
