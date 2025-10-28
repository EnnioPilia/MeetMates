package com.example.meetmates.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.meetmates.model.core.User;
import com.example.meetmates.model.link.PictureUser;

public interface PictureUserRepository extends JpaRepository<PictureUser, java.util.UUID> {
    Optional<PictureUser> findByUser(User user);
}
