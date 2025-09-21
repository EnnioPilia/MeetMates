package com.example.meetmates.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.meetmates.model.ConversationUser;
import com.example.meetmates.model.ConversationUserId;

@Repository
public interface ConversationUserRepository extends JpaRepository<ConversationUser, ConversationUserId> {

    List<ConversationUser> findByConversationId(UUID conversationId);

    List<ConversationUser> findByUserId(UUID userId);
}
