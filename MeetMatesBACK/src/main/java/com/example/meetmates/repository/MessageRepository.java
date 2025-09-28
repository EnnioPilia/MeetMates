package com.example.meetmates.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.meetmates.model.conversation.Conversation;
import com.example.meetmates.model.conversation.Message;
import com.example.meetmates.model.core.User;

@Repository
public interface MessageRepository extends JpaRepository<Message, UUID> {

    // Récupérer tous les messages d’une conversation
    List<Message> findByConversationOrderByCreatedAtAsc(Conversation conversation);

    // Récupérer tous les messages envoyés par un utilisateur
    List<Message> findBySender(User sender);

    // Récupérer les messages non supprimés d’une conversation
    List<Message> findByConversationAndDeletedAtIsNullOrderByCreatedAtAsc(Conversation conversation);
}
