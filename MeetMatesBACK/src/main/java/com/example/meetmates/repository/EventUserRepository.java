package com.example.meetmates.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.meetmates.model.core.EventUser;

@Repository
public interface EventUserRepository extends JpaRepository<EventUser, UUID> {
}
