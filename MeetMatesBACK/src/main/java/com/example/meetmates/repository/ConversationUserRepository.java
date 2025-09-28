package com.example.meetmates.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.meetmates.model.link.ConversationUser;
import com.example.meetmates.model.link.ConversationUserID;

@Repository
public interface ConversationUserRepository extends JpaRepository<ConversationUser, ConversationUserID> {

    List<ConversationUser> findByConversationId(UUID conversationId);

    List<ConversationUser> findByUserId(UUID userId);
}
