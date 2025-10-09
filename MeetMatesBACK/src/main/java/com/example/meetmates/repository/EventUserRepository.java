package com.example.meetmates.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.meetmates.model.core.EventUser;

public interface EventUserRepository extends JpaRepository<EventUser, UUID> {

    boolean existsByEventIdAndUserId(UUID eventId, UUID userId);

    Optional<EventUser> findByEventIdAndUserId(UUID eventId, UUID userId);

    List<EventUser> findAllByUserId(UUID userId);

    List<EventUser> findAllByEventId(UUID eventId);
}
