package com.example.meetmates.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.meetmates.model.conversation.Conversation;
import com.example.meetmates.model.core.Event;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, UUID> {

    // Récupérer toutes les conversations liées à un event
    List<Conversation> findByEvent(Event event);

    // Vérifier si une conversation existe pour un event
    boolean existsByEvent(Event event);
}
