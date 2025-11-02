package com.example.meetmates.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.meetmates.model.Notification;
import com.example.meetmates.model.User;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, UUID> {

    // Récupérer toutes les notifications d’un utilisateur
    List<Notification> findByRecipient(User recipient);

    // Récupérer toutes les notifications non lues d’un utilisateur
    List<Notification> findByRecipientAndReadFalse(User recipient);

    // Supprimer toutes les notifications d’un utilisateur
    void deleteByRecipient(User recipient);
}
