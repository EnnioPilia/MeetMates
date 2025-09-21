package com.example.meetmates.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.meetmates.model.EventUser;
import com.example.meetmates.model.EventUserId;

@Repository
public interface EventUserRepository extends JpaRepository<EventUser, EventUserId> {

    List<EventUser> findByEventId(UUID eventId);

    List<EventUser> findByUserId(UUID userId);
}
